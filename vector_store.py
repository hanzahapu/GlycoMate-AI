import os

# OpenAI embedding model converts text chunks into vector numbers
from langchain_openai import OpenAIEmbeddings

# FAISS is used to store and search vector embeddings
from langchain_community.vectorstores import FAISS

def create_vector_store(chunks, store_path: str):
    # Create embedding model
    embeddings = OpenAIEmbeddings()

    # Convert document chunks into embeddings and store them in FAISS
    vector_store = FAISS.from_documents(chunks, embeddings)

    # Save the FAISS vector store locally
    vector_store.save_local(store_path)

    # Return created vector store
    return vector_store

def load_vector_store(store_path: str):
    # Create the same embedding model used during index creation
    embeddings = OpenAIEmbeddings()

    # Check whether saved vector store exists
    if os.path.exists(store_path):

        # Load saved FAISS vector store from local folder
        return FAISS.load_local(store_path, embeddings, allow_dangerous_deserialization=True)
    
    # Return None if vector store is not found
    return None
