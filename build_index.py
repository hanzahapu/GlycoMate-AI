import os
import sys

# Loads and splits PDF content into chunks
from backend.app.rag.pdf_loader import load_and_chunk_pdf

# Creates and saves the FAISS vector store
from backend.app.rag.vector_store import create_vector_store

# Loads environment variables
from dotenv import load_dotenv

load_dotenv()

def build_index():
    # PDF source folder
    pdf_dir = os.path.join("data", "pdf")

    # Vector store output folder
    store_path = os.path.join("data", "vectorstore")
    
    # Store extracted chunks
    all_chunks = []
    

    # Stop if PDF folder does not exist
    if not os.path.exists(pdf_dir):
        print(f"Error: PDF directory not found at {pdf_dir}")
        return
    
    # Read all PDF files in the folder
    for filename in os.listdir(pdf_dir):

        # Process only PDF files
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(pdf_dir, filename)
            print(f"Loading and chunking {filename}...")

            try:
                chunks = load_and_chunk_pdf(pdf_path)

                if chunks:
                    # Add chunks to main list
                    all_chunks.extend(chunks)
                    print(f"Added {len(chunks)} chunks from {filename}")

                else:
                    # No readable text found
                    print(f"Warning: No text extracted from {filename} (It may be image-based)")

            except Exception as e:
                # Continue even if one PDF fails
                print(f"Error processing {filename}: {e}")
    
    # Create vector database if chunks exist
    if all_chunks:
        print(f"Creating vector store for {len(all_chunks)} total chunks...")

        # Convert chunks into embeddings and save in FAISS
        create_vector_store(all_chunks, store_path)
        print("Done!")

    else:
        # No valid PDF text found
        print("Error: No text extracted from any PDF documents in data/pdf/.")
        print("Please ensure at least one text-searchable PDF is present.")

# Run this file directly
if __name__ == "__main__":

    # Add project root to Python path
    sys.path.append(os.getcwd())
    
    # Build the RAG index
    build_index()
