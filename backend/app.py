from flask import Flask, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
from pdf2docx import Converter as PdfToDocxConverter
from docx2pdf import convert as DocxToPdfConverter
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
    
    # Specify the output file
    DocxToPdfConverter(file_path, pdf_file)  
    return pdf_file

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
