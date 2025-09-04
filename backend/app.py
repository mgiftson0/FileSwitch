from flask import Flask, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
from pdf2docx import Converter as PdfToDocxConverter
from flask_cors import CORS
import logging

app = Flask(__name__)

# CORS configuration
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        conversion_type = request.form.get('type', 'pdf_to_word')
        print(f"Conversion type: {conversion_type}")  # Debug log
        
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        print(f"File saved: {file_path}")  # Debug log

        # Handle different conversion types
        if conversion_type == 'pdf_to_word':
            converted_file_path = convert_pdf_to_word(file_path)
        elif conversion_type == 'word_to_pdf':
            converted_file_path = convert_word_to_pdf(file_path)
        elif conversion_type == 'html_to_pdf':
            converted_file_path = convert_html_to_pdf_simple(file_path)
        elif conversion_type == 'text_to_docx':
            converted_file_path = convert_text_to_docx_simple(file_path)
        else:
            return jsonify({'error': 'Invalid conversion type'}), 400

        converted_filename = os.path.basename(converted_file_path)
        print(f"Converted file: {converted_filename}")  # Debug log
        
        return jsonify({
            'original_id': filename,
            'converted_id': converted_filename
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug log
        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500

def convert_pdf_to_word(file_path):
    docx_file = file_path.replace('.pdf', '.docx')
    cv = PdfToDocxConverter(file_path)
    cv.convert(docx_file)
    cv.close()
    return docx_file

def convert_word_to_pdf(file_path):
    # This will require the packages we discussed earlier
    # For now, just return an error message
    raise Exception("Word to PDF conversion not implemented yet. Install python-docx and reportlab first.")

def convert_html_to_pdf_simple(file_path):
    """Simple HTML to PDF conversion using reportlab with better text extraction"""
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        import re
        
        pdf_file = file_path.replace('.html', '.pdf')
        
        # Read HTML file
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Extract only the body content and remove style tags
        # Remove everything between <style> and </style>
        html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL)
        # Remove everything between <head> and </head>
        html_content = re.sub(r'<head[^>]*>.*?</head>', '', html_content, flags=re.DOTALL)
        
        # Extract body content only
        body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL)
        if body_match:
            content = body_match.group(1)
        else:
            content = html_content
        
        # Remove HTML tags but preserve basic structure
        content = re.sub(r'<br[^>]*>', '\n', content)  # Convert <br> to newlines
        content = re.sub(r'</p>', '\n', content)       # Convert </p> to newlines
        content = re.sub(r'</h[1-6]>', '\n', content)  # Convert heading ends to newlines
        content = re.sub(r'<[^>]+>', '', content)      # Remove all other HTML tags
        
        # Clean up extra whitespace and decode HTML entities
        content = re.sub(r'\n\s*\n', '\n\n', content)  # Multiple newlines to double newlines
        content = content.replace('&nbsp;', ' ')
        content = content.replace('&amp;', '&')
        content = content.replace('&lt;', '<')
        content = content.replace('&gt;', '>')
        content = content.strip()
        
        # Create PDF
        c = canvas.Canvas(pdf_file, pagesize=letter)
        width, height = letter
        y_position = height - 50
        
        # Split content into lines and add to PDF
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                y_position -= 10  # Add some space for empty lines
                continue
                
            # Simple line wrapping
            if len(line) > 90:
                words = line.split()
                current_line = ""
                for word in words:
                    if len(current_line + word) < 90:
                        current_line += word + " "
                    else:
                        if current_line:
                            c.drawString(50, y_position, current_line.strip())
                            y_position -= 15
                        current_line = word + " "
                        if y_position < 50:
                            c.showPage()
                            y_position = height - 50
                if current_line:
                    c.drawString(50, y_position, current_line.strip())
                    y_position -= 15
            else:
                c.drawString(50, y_position, line)
                y_position -= 15
            
            if y_position < 50:
                c.showPage()
                y_position = height - 50
        
        c.save()
        return pdf_file
        
    except ImportError:
        raise Exception("HTML to PDF requires reportlab. Install with: pip install reportlab")
    except Exception as e:
        raise Exception(f"HTML to PDF conversion failed: {str(e)}")

def convert_text_to_docx_simple(file_path):
    """Simple text to DOCX conversion"""
    try:
        from docx import Document
        
        docx_file = file_path.replace('.txt', '.docx')
        
        # Create new document
        doc = Document()
        
        # Read text file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Add paragraphs
        paragraphs = content.split('\n')
        for para in paragraphs:
            doc.add_paragraph(para if para.strip() else '')
        
        doc.save(docx_file)
        return docx_file
        
    except ImportError:
        raise Exception("Text to DOCX requires python-docx. Install with: pip install python-docx")
    except Exception as e:
        raise Exception(f"Text to DOCX conversion failed: {str(e)}")

@app.route('/download/<path:filename>')
def download_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)