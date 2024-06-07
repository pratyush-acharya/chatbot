# WFT Chatbot Server

## Folders & files structure

- db: This contains the embedded data after ingest.py is run
- models: This contains the downloaded models mostly used for opensource models.
  Currently this is not being used but will be in the future.
- source: This folder contains the documents that are to be ingested for our vector database i.e our knowledge base, this will be different according to projects
- .env: environment variable used in the app, this file is to be ignored by git as for the contents for now this consists of:

```sh
OPENAI_API_KEY=(your api key)
PERSIST_DIRECTORY=(the directory in which embeded vector database is stored, in our case ./db)
SOURCE_DIRECTORY=(As the name implies the location to our source directory, in our case ./source)
EMBEDDINGS_MODEL_NAME=(The name of embedding model used, for now we are only ada openai model)
TARGET_SOURCE_CHUNKS=(the target chunks for searching the database)
```

- ingest.py: this script converts the documents in source directory and embeds them & stores them in a vector database in db folder. For detailed info and their functions refer to the comments in code.

- main.py: this script contains the main flask api with respective app routes.

## Installation Notes

To install dependencies run:

```sh
pip install -r requirements.txt
```

Then run the below:

```sh
pip install urllib3==1.26.6
```

To fix the lingering OpenSSL issue.

Now, you can execute:

```sh
python main.py
```

The server should be running on Port 5000.

# For Deployment

- Build the docker image using:

```sh
docker build -t wft-chat-bak:naasa -f Dockerfile .
```

- Run the same using:

````
docker run -d -p 8000:5000 --name wft-chat-bak-naasa wft-chat-bak:naasa
```sh
````
