from src.helper import load_pdf,text_splitter,download_hugging_face_embedding

from pinecone import Pinecone

from langchain_pinecone import PineconeVectorStore

from dotenv import load_dotenv

import os

load_dotenv()

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")

print(PINECONE_API_KEY)

data=r"C:\Users\user\Documents\Github\projects\LlamaAi\AnsiAssistance\data\E2624-17-SP-Torque-Calibration-Testing-Machine.pdf"

documents = load_pdf(data)

text_chunks = text_splitter(documents)

embeddings = download_hugging_face_embedding()

pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

index_name = "ansichatbot"

index = pc.Index(index_name)