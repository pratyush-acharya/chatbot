from flask import Flask,jsonify, render_template, flash, redirect, url_for, Markup, request
from flask_cors import CORS
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.vectorstores import Chroma
from langchain.llms import GPT4All, LlamaCpp
import os
import glob
from typing import List
import requests

from langchain.document_loaders import (
    CSVLoader,
    EverNoteLoader,
    PDFMinerLoader,
    TextLoader,
    UnstructuredEmailLoader,
    UnstructuredEPubLoader,
    UnstructuredHTMLLoader,
    UnstructuredMarkdownLoader,
    UnstructuredODTLoader,
    UnstructuredPowerPointLoader,
    UnstructuredWordDocumentLoader,
)

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.docstore.document import Document
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
import os
from langchain.prompts import HumanMessagePromptTemplate, SystemMessagePromptTemplate, ChatPromptTemplate
import os
import glob
from typing import List
from dotenv import load_dotenv
from multiprocessing import Pool
from tqdm import tqdm

from langchain.document_loaders import (
    CSVLoader,
    EverNoteLoader,
    PDFMinerLoader,
    TextLoader,
    UnstructuredEmailLoader,
    UnstructuredEPubLoader,
    UnstructuredHTMLLoader,
    UnstructuredMarkdownLoader,
    UnstructuredODTLoader,
    UnstructuredPowerPointLoader,
    UnstructuredWordDocumentLoader,
)

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.docstore.document import Document


from constants import CHROMA_SETTINGS

app = Flask(__name__)
CORS(app)

load_dotenv()

# Load environment variables
openai_api_key = os.environ.get('OPENAI_API_KEY')
persist_directory = os.environ.get('PERSIST_DIRECTORY')
source_directory = os.environ.get('SOURCE_DIRECTORY', 'source_documents')
embeddings_model_name = os.environ.get('EMBEDDINGS_MODEL_NAME')
chunk_size = 500
chunk_overlap = 50
embeddings_model_name = os.environ.get("EMBEDDINGS_MODEL_NAME")
persist_directory = os.environ.get('PERSIST_DIRECTORY')

model_type = os.environ.get('MODEL_TYPE')
model_path = os.environ.get('MODEL_PATH')
model_n_ctx = os.environ.get('MODEL_N_CTX')
chat_model_name = 'gpt-3.5-turbo'
target_source_chunks = int(os.environ.get('TARGET_SOURCE_CHUNKS',4))
llm = ChatOpenAI(model_name=chat_model_name, openai_api_key=openai_api_key, temperature=0)



from constants import CHROMA_SETTINGS

# Custom document loaders
class MyElmLoader(UnstructuredEmailLoader):
    """Wrapper to fallback to text/plain when default does not work"""

    def load(self) -> List[Document]:
        """Wrapper adding fallback for elm without html"""
        try:
            try:
                doc = UnstructuredEmailLoader.load(self)
            except ValueError as e:
                if 'text/html content not found in email' in str(e):
                    # Try plain text
                    self.unstructured_kwargs["content_source"]="text/plain"
                    doc = UnstructuredEmailLoader.load(self)
                else:
                    raise
        except Exception as e:
            # Add file_path to exception message
            raise type(e)(f"{self.file_path}: {e}") from e

        return doc


# Map file extensions to document loaders and their arguments
LOADER_MAPPING = {
    ".csv": (CSVLoader, {}),
    # ".docx": (Docx2txtLoader, {}),
    ".doc": (UnstructuredWordDocumentLoader, {}),
    ".docx": (UnstructuredWordDocumentLoader, {}),
    ".enex": (EverNoteLoader, {}),
    ".eml": (MyElmLoader, {}),
    ".epub": (UnstructuredEPubLoader, {}),
    ".html": (UnstructuredHTMLLoader, {}),
    ".md": (UnstructuredMarkdownLoader, {}),
    ".odt": (UnstructuredODTLoader, {}),
    ".pdf": (PDFMinerLoader, {}),
    ".ppt": (UnstructuredPowerPointLoader, {}),
    ".pptx": (UnstructuredPowerPointLoader, {}),
    ".txt": (TextLoader, {"encoding": "utf8"}),
    # Add more mappings for other file extensions and loaders as needed
}


def load_single_document(file_path: str) -> Document:
    """
    Loads a single document from the given file path.

    Args:
        file_path (str): The path of the file to load.

    Returns:
        Document: The loaded document.

    Raises:
        ValueError: If the file extension is not supported.
    """
    ext = "." + file_path.rsplit(".", 1)[-1]
    if ext in LOADER_MAPPING:
        loader_class, loader_args = LOADER_MAPPING[ext]
        loader = loader_class(file_path, **loader_args)
        return loader.load()[0]

    raise ValueError(f"Unsupported file extension '{ext}'")


def load_documents(source_dir: str, ignored_files: List[str] = []) -> List[Document]:
    """
    Loads all documents from the source documents directory, ignoring specified files
    """
    all_files = []
    for ext in LOADER_MAPPING:
        all_files.extend(
            glob.glob(os.path.join(source_dir, f"**/*{ext}"), recursive=True)
        )
    filtered_files = [file_path for file_path in all_files if file_path not in ignored_files]

    with Pool(processes=os.cpu_count()) as pool:
        results = []
        with tqdm(total=len(filtered_files), desc='Loading new documents', ncols=80) as pbar:
            for i, doc in enumerate(pool.imap_unordered(load_single_document, filtered_files)):
                results.append(doc)
                pbar.update()

    return results

def process_documents(ignored_files: List[str] = []) -> List[Document]:
    """
    Load documents and split in chunks
    """
    print(f"Loading documents from {source_directory}")
    documents = load_documents(source_directory, ignored_files)
    if not documents:
        print("No new documents to load")
        exit(0)
    print(f"Loaded {len(documents)} new documents from {source_directory}")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    texts = text_splitter.split_documents(documents)
    print(f"Split into {len(texts)} chunks of text (max. {chunk_size} tokens each)")
    return texts

def does_vectorstore_exist(persist_directory: str) -> bool:
    """
    Checks if vectorstore exists
    """
    if os.path.exists(os.path.join(persist_directory, 'index')):
        if os.path.exists(os.path.join(persist_directory, 'chroma-collections.parquet')) and os.path.exists(os.path.join(persist_directory, 'chroma-embeddings.parquet')):
            list_index_files = glob.glob(os.path.join(persist_directory, 'index/*.bin'))
            list_index_files += glob.glob(os.path.join(persist_directory, 'index/*.pkl'))
            # At least 3 documents are needed in a working vectorstore
            if len(list_index_files) > 3:
                return True
    return False

def process_query(query, messages, retriever, llm):
    """
    Process a user query message by appending it to the conversation history, generating a chat prompt,
    running it through a retrieval-based QA model, appending the answer to the conversation history,
    and returning the updated conversation history and the retrieved answer.

    :param query: The text of the user's query message.
    :type query: str
    :param messages: A list of previous conversation messages.
    :type messages: List[Union[HumanMessagePromptTemplate, SystemMessagePromptTemplate]]
    :param retriever: A retrieval model used to select relevant documents for the QA model.
    :type retriever: RetrievalModel
    :param llm: A language model used for generating the chat prompt and answering the query.
    :type llm: LanguageModel
    :return: A tuple containing the updated conversation history (list of messages) and the retrieved answer (str).
    :rtype: Tuple[List[Union[HumanMessagePromptTemplate, SystemMessagePromptTemplate]], str]
    """
    messages.append(HumanMessagePromptTemplate.from_template(query))
    prompt = ChatPromptTemplate.from_messages(messages)

    chain_type_kwargs = {"prompt": prompt}
    chain = RetrievalQAWithSourcesChain.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs=chain_type_kwargs
    )

    result = chain(query)

    # Add the answer to the conversation context
    messages.append(SystemMessagePromptTemplate.from_template(result['answer']))

    return messages, result['answer']

@app.route('/ingest', methods=['GET'])
def ingest_data():
    """
    Ingest data and create a vectorstore with embeddings from OpenAI. If a vectorstore
    already exists, update it with new documents and embeddings. Otherwise, create a new
    vectorstore. Returns a JSON response with a success message.
    """
    embeddings = OpenAIEmbeddings(model=embeddings_model_name, openai_api_key=os.environ.get('OPENAI_API_KEY'))

    if does_vectorstore_exist(persist_directory):
        # Update and store locally vectorstore
        print(f"Appending to existing vectorstore at {persist_directory}")
        db = Chroma(persist_directory=persist_directory, embedding_function=embeddings, client_settings=CHROMA_SETTINGS)
        collection = db.get()
        texts = process_documents([metadata['source'] for metadata in collection['metadatas']])
        print(f"Creating embeddings. May take some minutes...")
        db.add_documents(texts)
    else:
        # Create and store locally vectorstore
        print("Creating new vectorstore")
        texts = process_documents()
        print(f"Creating embeddings. May take some minutes...")
        db = Chroma.from_documents(texts, embeddings, persist_directory=persist_directory, client_settings=CHROMA_SETTINGS)
    db.persist()
    db = None

    print(f"Ingestion complete! You can now run main.py to query your documents")
    return jsonify(response="Success")
    
@app.route('/get_answer', methods=['POST'])
def get_answer():
    """
    Flask route to retrieve an answer using OpenAI embeddings and Chroma. 
    The function takes no parameters but uses the following pre-defined variables:
    - embeddings_model_name: the name of the embeddings model
    - openai_api_key: the key to access the OpenAI API
    - persist_directory: the directory to persist the Chroma database
    - CHROMA_SETTINGS: the settings for the Chroma client
    - target_source_chunks: the target chunks for searching the database
    The function creates an OpenAI embeddings object, Chroma database object, and retriever object for the 
    target source chunks. It then prepares a ChatOpenAI object and a system template for answering questions.
    Finally, it processes the query using the process_query function and returns the query and answer as a JSON object.
    """
    embeddings = OpenAIEmbeddings(model=embeddings_model_name, openai_api_key=openai_api_key)
    db = Chroma(persist_directory=persist_directory, embedding_function=embeddings, client_settings=CHROMA_SETTINGS)
    retriever = db.as_retriever(search_kwargs={"k": target_source_chunks})

    # Prepare the LLM
    llm = ChatOpenAI(model_name=chat_model_name, openai_api_key=openai_api_key, temperature=0)
    # qa = RetrievalQAWithSourcesChain.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever, return_source_documents=True)
    # Interactive questions and answers
    system_template = """You are a customer chatbot for  Naasa Securities.
You can answer questions about Naasa securities and it' services.
You are a customer chat bot for NAASA Securities which one of the leading Brokerage Firm of stock trading in Nepal,The broker number of NAASA Securities is 58.
Your job is to answer the queries provided by the given context.
You are not allowed to make up any facts.
If you do not know the answer, simply tell the customer to contact at the office.
Whenever you cite any information on Naasa Securities ensure it is from a perspective that you are a part of Naasa Securities.
Whenever you are asked a question about Naasa Securities respond like you are a part of it,
also don't mention that you are AI language model instead say that you are an AI bot designed to help customers.
Whenever you are asked if Naasa securities is opened or not, say "Our usual office hours are from 10:00 AM to 5:00 PM, Sunday to Friday. We are closed on Saturdays and public holidays. You can contact us at 01-5970084 or email us at info@naasasecurities.com.np for more information".
Whenever you are asked about buisness hours, say "Our usual office hours are from 10:00 AM to 5:00 PM, Sunday to Friday. We are closed on Saturdays and public holidays. You can contact us at 01-5970084 or email us at info@naasasecurities.com.np for more information".
Don't confuse 58 number with anything else, 58 is the broker number of NAASA Securities.
For any queries related to EDIS, say "You can contact us at 01-5970084 or email us at edis@naasasecurities.com.np for more information related to EDIS".
Wherever next to Jay Nepal Hall is mentioned replace it with "near Jai Nepal Cinema Hall".
The link for Trade Management System (TMS) 58 is "https://tms58.nepsetms.com.np/login".
You do not make up any answer that is provided about Meroshare,Naasa Securities,CDSC or SEBON.
Treat the following words as cuss words: "mula", "mujhi".
The phone number for Naasa Securities is "01-5970084".
The Head Office is at Lal Colony Marg,Kathmandu.
----------------
{summaries}"""
    while True:
        messages = [SystemMessagePromptTemplate.from_template(system_template)]
        query = request.json
        print(query,"query")
        if query == "exit":
            break
        messages, answer = process_query(query, messages, retriever, llm)
        print(answer)
        return jsonify(query=query,answer=answer)


@app.route('/upload_doc', methods=['POST'])
def upload_doc():
    
    if 'document' not in request.files:
        return jsonify(response="No document file found"), 400
    
    document = request.files['document']
    if document.filename == '':
        return jsonify(response="No selected file"), 400

    filename = document.filename
    save_path = os.path.join('source_documents', filename)
    document.save(save_path)

    return jsonify(response="Document upload successful")

@app.route('/download_model', methods=['GET'])
def download_and_save():
    """
    Downloads a model from a specified URL and saves it to a specified folder if it does not already exist.
    Returns a JSON response confirming completion of download.
    """
    url = 'https://gpt4all.io/models/ggml-gpt4all-j-v1.3-groovy.bin'  # Specify the URL of the resource to download
    filename = 'ggml-gpt4all-j-v1.3-groovy.bin'  # Specify the name for the downloaded file
    models_folder = 'models'  # Specify the name of the folder inside the Flask app root

    if not os.path.exists(models_folder):
        os.makedirs(models_folder)
    response = requests.get(url,stream=True)
    total_size = int(response.headers.get('content-length', 0))
    bytes_downloaded = 0
    file_path = f'{models_folder}/{filename}'
    if os.path.exists(file_path):
        return jsonify(response="Download completed")

    with open(file_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=4096):
            file.write(chunk)
            bytes_downloaded += len(chunk)
            progress = round((bytes_downloaded / total_size) * 100, 2)
            print(f'Download Progress: {progress}%')
    global llm
    callbacks = [StreamingStdOutCallbackHandler()]
    llm = GPT4All(model=model_path, n_ctx=model_n_ctx, backend='gptj', callbacks=callbacks, verbose=False)
    return jsonify(response="Download completed")

if __name__ == "__main__":
  print("LLM0", llm)
  app.run(host="0.0.0.0", port=8000, debug = False)
