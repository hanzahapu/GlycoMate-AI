# Loads PDF files and extracts text page by page
from langchain_community.document_loaders import PyPDFLoader

# Splits long text into smaller chunks for RAG retrieval
from langchain_text_splitters import RecursiveCharacterTextSplitter

def load_and_chunk_pdf(pdf_path: str):
    # Load the PDF from the given file path
    loader = PyPDFLoader(pdf_path)

    # Extract text from the PDF pages
    documents = loader.load()
    
    # Create text splitter with chunk size and overlap
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        add_start_index=True
    )

    # Split PDF text into smaller document chunks
    chunks = text_splitter.split_documents(documents)

    # Return chunks to be used for vector store creation
    return chunks
