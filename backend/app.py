from flask import Flask, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
from pdf2docx import Converter as PdfToDocxConverter
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # 'pdf_to_word' or 'word_to_pdf'
    file_type = request.form.get('type', 'pdf_to_word')  

    # Check file extension and type
    if file_type == 'pdf_to_word' and not allowed_file(file.filename, file_type):
        return jsonify({'error': 'Unsupported file type for this conversion'}), 400
    elif file_type == 'word_to_pdf' and not allowed_file(file.filename, file_type):
        return jsonify({'error': 'Unsupported file type for this conversion'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    if file_type == 'pdf_to_word':
        converted_file_path = convert_pdf_to_word(file_path)
    elif file_type == 'word_to_pdf':
        converted_file_path = convert_word_to_pdf(file_path)
    else:
        return jsonify({'error': 'Invalid conversion type'}), 400

    converted_filename = os.path.basename(converted_file_path)
    return jsonify({
        'original_id': filename,
        'converted_id': converted_filename
    }), 200

def convert_pdf_to_word(file_path):
    docx_file = file_path.replace('.pdf', '.docx')
    cv = PdfToDocxConverter(file_path)
    cv.convert(docx_file)
    cv.close()
    return docx_file

def convert_word_to_pdf(file_path):
    pdf_file = file_path.replace('.docx', '.pdf')
    
    # Try different methods
    try:
        # Method 1: Try subprocess with LibreOffice (if installed)
        import subprocess
        
        # Get directory
        output_dir = os.path.dirname(file_path)
        
        # Try LibreOffice command
        cmd = ['soffice', '--headless', '--convert-to', 'pdf', '--outdir', output_dir, file_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0 and os.path.exists(pdf_file):
            return pdf_file
        else:
            raise Exception("LibreOffice conversion failed")
            
    except:
        # Method 2: Try python-docx + reportlab (basic conversion)
        try:
            from docx import Document
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            
            # Read docx
            doc = Document(file_path)
            
            # Create PDF
            c = canvas.Canvas(pdf_file, pagesize=letter)
            width, height = letter
            y_position = height - 50
            
            for paragraph in doc.paragraphs:
                if paragraph.text.strip():
                    # Simple text wrapping
                    text = paragraph.text
                    if len(text) > 80:
                        words = text.split()
                        line = ""
                        for word in words:
                            if len(line + word) < 80:
                                line += word + " "
                            else:
                                c.drawString(50, y_position, line.strip())
                                y_position -= 20
                                line = word + " "
                                if y_position < 50:
                                    c.showPage()
                                    y_position = height - 50
                        if line.strip():
                            c.drawString(50, y_position, line.strip())
                            y_position -= 20
                    else:
                        c.drawString(50, y_position, text)
                        y_position -= 20
                    
                    if y_position < 50:
                        c.showPage()
                        y_position = height - 50
            
            c.save()
            
            if os.path.exists(pdf_file):
                return pdf_file
            else:
                raise Exception("PDF creation failed")
                
        except ImportError:
            return jsonify({'error': 'Word to PDF conversion requires additional libraries. Please install: pip install python-docx reportlab'}), 500
        except Exception as e:
            raise Exception(f"Word to PDF conversion failed: {str(e)}")
    
    raise Exception("All conversion methods failed")

@app.route('/download/<path:filename>')
def download_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({'error': 'File not found'}), 404

def allowed_file(filename, file_type):
    if file_type == 'pdf_to_word':
        return filename.lower().endswith('.pdf')
    elif file_type == 'word_to_pdf':
        return filename.lower().endswith('.docx')
    return False

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)