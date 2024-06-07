# Pull from node alpine docker image,use current alpine version
FROM python:3.11.2-slim

# Set src/app as work directory
WORKDIR /app

# Copy All project files
COPY . /app

# Build
RUN apt-get update -y
RUN apt-get install -y build-essential
RUN pip3 install -r requirements.txt
RUN pip3 install openai
RUN python3 ingest.py

# Expose & Set ENV port to 3012
EXPOSE 8000

# Serve the build
#CMD ["uvicorn", "main:app", "--reload"]
CMD ["python3", "main.py"]
