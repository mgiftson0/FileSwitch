try:
    from pdf2docx import Converter
    print("pdf2docx imported successfully")
except ImportError as e:
    print(f"ImportError: {e}")
