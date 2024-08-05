from flask import Flask, request, jsonify, send_file
import os
import logging
from werkzeug.utils import secure_filename
from pdf2docx import Converter as PdfToDocxConverter
from docx2pdf import convert as DocxToPdfConverter
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit upload size to 16MB

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/upload', methods=['POST'])
def upload_file():
    app.logger.info('Received upload request')
    if 'file' not in request.files:
        app.logger.error('No file part in the request')
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        app.logger.error('No selected file')
        return jsonify({'error': 'No selected file'}), 400
    
    file_type = request.form.get('type', 'pdf_to_word')
    app.logger.info(f'Conversion type: {file_type}')

    if not allowed_file(file.filename, file_type):
        app.logger.error(f'Unsupported file type: {file.filename}')
        return jsonify({'error': 'Unsupported file type for this conversion'}), 400

    try:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        app.logger.info(f'File saved: {file_path}')

        if file_type == 'pdf_to_word':
            converted_file_path = convert_pdf_to_word(file_path)
        elif file_type == 'word_to_pdf':
            converted_file_path = convert_word_to_pdf(file_path)
        else:
            app.logger.error(f'Invalid conversion type: {file_type}')
            return jsonify({'error': 'Invalid conversion type'}), 400

        converted_filename = os.path.basename(converted_file_path)
        app.logger.info(f'Conversion successful: {converted_filename}')
        return jsonify({
            'original_id': filename,
            'converted_id': converted_filename
        }), 200
    except Exception as e:
        app.logger.error(f'Error during file processing: {str(e)}')
        return jsonify({'error': 'An error occurred during file processing'}), 500

def convert_pdf_to_word(file_path):
    app.logger.info(f'Converting PDF to Word: {file_path}')
    docx_file = file_path.replace('.pdf', '.docx')
    cv = PdfToDocxConverter(file_path)
    cv.convert(docx_file)
    cv.close()
    return docx_file

def convert_word_to_pdf(file_path):
    app.logger.info(f'Converting Word to PDF: {file_path}')
    pdf_file = file_path.replace('.docx', '.pdf')
    DocxToPdfConverter(file_path, pdf_file)
    return pdf_file

@app.route('/download/<path:filename>')
def download_file(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        app.logger.info(f'Sending file: {file_path}')
        return send_file(file_path, as_attachment=True)
    else:
        app.logger.error(f'File not found: {file_path}')
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
    app.run(debug=True, host='0.0.0.0')