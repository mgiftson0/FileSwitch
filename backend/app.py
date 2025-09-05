from flask import Flask, request, jsonify, send_file
import os
from werkzeug.utils import secure_filename
from pdf2docx import Converter as PdfToDocxConverter
from flask_cors import CORS
import logging
import re
from bs4 import BeautifulSoup

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
            converted_file_path = convert_html_to_pdf_enhanced(file_path)
        elif conversion_type == 'text_to_docx':
            converted_file_path = convert_html_to_docx_enhanced(file_path)
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
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500

def convert_pdf_to_word(file_path):
    docx_file = file_path.replace('.pdf', '.docx')
    cv = PdfToDocxConverter(file_path)
    cv.convert(docx_file)
    cv.close()
    return docx_file

def convert_word_to_pdf(file_path):
    raise Exception("Word to PDF conversion not implemented yet.")

def convert_html_to_pdf_enhanced(file_path):
    """Enhanced HTML to PDF conversion with full Quill formatting support"""
    try:
        from reportlab.pdfgen import canvas
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
        from reportlab.lib.units import inch
        from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
        from reportlab.lib import colors
        
        pdf_file = file_path.replace('.html', '.pdf')
        
        # Read HTML file
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        print(f"Raw HTML content preview: {html_content[:500]}...")  # Debug log
        
        # Extract body content
        body_content = extract_body_content(html_content)
        print(f"Extracted body content: {body_content[:300]}...")  # Debug log
        
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(body_content, 'html.parser')
        
        # Create PDF document
        doc = SimpleDocTemplate(pdf_file, pagesize=letter, 
                              rightMargin=72, leftMargin=72, 
                              topMargin=72, bottomMargin=72)
        
        # Get styles and create enhanced custom ones
        styles = getSampleStyleSheet()
        create_enhanced_styles(styles)
        
        story = []
        
        # Process the HTML content more comprehensively
        process_html_elements(soup, story, styles)
        
        # If no content was processed, add a simple paragraph
        if not story:
            story.append(Paragraph("No content to display", styles['CustomNormal']))
        
        print(f"Building PDF with {len(story)} elements...")  # Debug log
        doc.build(story)
        print(f"PDF created successfully: {pdf_file}")  # Debug log
        
        return pdf_file
        
    except ImportError as import_error:
        print(f"Import error: {import_error}")
        raise Exception("PDF generation requires reportlab. Install with: pip install reportlab beautifulsoup4")
    except Exception as e:
        print(f"Detailed error in PDF conversion: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"HTML to PDF conversion failed: {str(e)}")

def convert_html_to_docx_enhanced(file_path):
    """Enhanced HTML to DOCX conversion with full Quill formatting support"""
    try:
        from docx import Document
        from docx.shared import Pt, RGBColor
        from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX
        from docx.enum.style import WD_STYLE_TYPE
        
        docx_file = file_path.replace('.html', '.docx').replace('.txt', '.docx')
        
        # Read file content
        if file_path.endswith('.html'):
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            content = extract_body_content(html_content)
        else:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        
        print(f"Processing HTML content for DOCX...")  # Debug log
        print(f"Content preview: {content[:300]}...")  # Debug log
        
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(content, 'html.parser')
        
        # Create new document
        doc = Document()
        
        # Process all content including text nodes
        process_html_for_docx(soup, doc)
        
        # If no content was added, add a default paragraph
        if len(doc.paragraphs) == 0:
            doc.add_paragraph("No content to display")
        
        print(f"Saving DOCX file: {docx_file}")  # Debug log
        doc.save(docx_file)
        print(f"DOCX created successfully")  # Debug log
        
        return docx_file
        
    except ImportError as import_error:
        print(f"Import error: {import_error}")
        raise Exception("DOCX generation requires python-docx and beautifulsoup4. Install with: pip install python-docx beautifulsoup4")
    except Exception as e:
        print(f"Detailed error in DOCX conversion: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"HTML to DOCX conversion failed: {str(e)}")

def create_enhanced_styles(styles):
    """Create enhanced styles for better formatting"""
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
    from reportlab.lib import colors
    
    # Enhanced heading styles
    for i in range(1, 7):
        style_name = f'CustomH{i}'
        font_size = max(24 - (i * 2), 12)
        styles.add(ParagraphStyle(
            name=style_name,
            parent=styles['Normal'],
            fontSize=font_size,
            spaceAfter=12,
            spaceBefore=8,
            textColor=colors.black,
            fontName='Helvetica-Bold'
        ))
    
    # Enhanced normal style
    styles.add(ParagraphStyle(
        name='CustomNormal',
        parent=styles['Normal'],
        fontSize=12,
        spaceAfter=6,
        textColor=colors.black,
        leading=16
    ))
    
    # Small text style
    styles.add(ParagraphStyle(
        name='CustomSmall',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=4,
        textColor=colors.black
    ))
    
    # Large text style
    styles.add(ParagraphStyle(
        name='CustomLarge',
        parent=styles['Normal'],
        fontSize=16,
        spaceAfter=8,
        textColor=colors.black
    ))
    
    # Huge text style
    styles.add(ParagraphStyle(
        name='CustomHuge',
        parent=styles['Normal'],
        fontSize=20,
        spaceAfter=10,
        textColor=colors.black
    ))
    
    # Center aligned style
    styles.add(ParagraphStyle(
        name='CustomCenter',
        parent=styles['CustomNormal'],
        alignment=TA_CENTER
    ))
    
    # Right aligned style
    styles.add(ParagraphStyle(
        name='CustomRight',
        parent=styles['CustomNormal'],
        alignment=TA_RIGHT
    ))
    
    # Justified style
    styles.add(ParagraphStyle(
        name='CustomJustify',
        parent=styles['CustomNormal'],
        alignment=TA_JUSTIFY
    ))

def process_html_elements(soup, story, styles):
    """Process HTML elements with comprehensive formatting detection"""
    from reportlab.platypus import Paragraph, Spacer, PageBreak
    
    # Get all elements and text nodes
    all_elements = soup.find_all(True) + [soup]
    
    for element in all_elements:
        try:
            # Skip if element is empty or already processed
            if not element or not element.name:
                continue
                
            element_text = element.get_text().strip()
            if not element_text and element.name != 'div':
                continue
            
            # Detect element type and formatting
            if element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                level = element.name[1]
                text = process_comprehensive_formatting(element)
                style = styles.get(f'CustomH{level}', styles['CustomNormal'])
                story.append(Paragraph(text, style))
                
            elif element.name == 'p':
                text = process_comprehensive_formatting(element)
                if text.strip():
                    # Detect alignment and size from classes
                    style = get_paragraph_style(element, styles)
                    story.append(Paragraph(text, style))
                    story.append(Spacer(1, 6))
                    
            elif element.name in ['ul', 'ol']:
                for li in element.find_all('li', recursive=False):
                    text = process_comprehensive_formatting(li)
                    if text.strip():
                        story.append(Paragraph(f"• {text}", styles['CustomNormal']))
                story.append(Spacer(1, 12))
                
            elif element.name == 'blockquote':
                text = process_comprehensive_formatting(element)
                if text.strip():
                    # Make blockquote italic and indented
                    text = f"<i>{text}</i>"
                    story.append(Paragraph(text, styles['CustomNormal']))
                    story.append(Spacer(1, 12))
                    
            elif element.name == 'div':
                # Check for page breaks
                if 'page-break' in str(element.get('class', [])):
                    story.append(PageBreak())
                else:
                    # Process div content
                    text = process_comprehensive_formatting(element)
                    if text.strip():
                        style = get_paragraph_style(element, styles)
                        story.append(Paragraph(text, style))
                        
        except Exception as e:
            print(f"Error processing element {element.name if element else 'unknown'}: {e}")
            continue

def process_comprehensive_formatting(element):
    """Process all formatting including bold, italic, underline, strikethrough, etc."""
    if not element:
        return ""
    
    # If it's a simple text element, return it
    if element.string:
        return escape_html(str(element.string))
    
    formatted_text = ""
    
    for content in element.contents:
        if hasattr(content, 'name') and content.name:
            inner_text = content.get_text()
            escaped_text = escape_html(inner_text)
            
            # Handle different formatting tags
            if content.name in ['strong', 'b'] or 'ql-bold' in str(content.get('class', [])):
                formatted_text += f"<b>{escaped_text}</b>"
            elif content.name in ['em', 'i'] or 'ql-italic' in str(content.get('class', [])):
                formatted_text += f"<i>{escaped_text}</i>"
            elif content.name == 'u' or 'ql-underline' in str(content.get('class', [])):
                formatted_text += f"<u>{escaped_text}</u>"
            elif content.name == 's' or 'ql-strike' in str(content.get('class', [])):
                formatted_text += f"<strike>{escaped_text}</strike>"
            elif content.name == 'sub' or 'ql-script' in str(content.get('class', [])) and 'sub' in str(content.get('value', '')):
                formatted_text += f"<sub>{escaped_text}</sub>"
            elif content.name == 'sup' or 'ql-script' in str(content.get('class', [])) and 'super' in str(content.get('value', '')):
                formatted_text += f"<super>{escaped_text}</super>"
            elif content.name == 'br':
                formatted_text += "<br/>"
            else:
                # Check for Quill-specific classes
                classes = str(content.get('class', []))
                if 'ql-bold' in classes:
                    formatted_text += f"<b>{escaped_text}</b>"
                elif 'ql-italic' in classes:
                    formatted_text += f"<i>{escaped_text}</i>"
                elif 'ql-underline' in classes:
                    formatted_text += f"<u>{escaped_text}</u>"
                elif 'ql-strike' in classes:
                    formatted_text += f"<strike>{escaped_text}</strike>"
                else:
                    formatted_text += escaped_text
        else:
            # Plain text content
            formatted_text += escape_html(str(content))
    
    return formatted_text.strip()

def get_paragraph_style(element, styles):
    """Get appropriate paragraph style based on element classes"""
    classes = str(element.get('class', []))
    
    # Check for alignment
    if 'ql-align-center' in classes:
        return styles.get('CustomCenter', styles['CustomNormal'])
    elif 'ql-align-right' in classes:
        return styles.get('CustomRight', styles['CustomNormal'])
    elif 'ql-align-justify' in classes:
        return styles.get('CustomJustify', styles['CustomNormal'])
    
    # Check for size
    if 'ql-size-small' in classes:
        return styles.get('CustomSmall', styles['CustomNormal'])
    elif 'ql-size-large' in classes:
        return styles.get('CustomLarge', styles['CustomNormal'])
    elif 'ql-size-huge' in classes:
        return styles.get('CustomHuge', styles['CustomNormal'])
    
    return styles['CustomNormal']

def process_html_for_docx(soup, doc):
    """Process HTML for DOCX with comprehensive formatting"""
    from docx.shared import Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    
    # Process all elements
    elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'div'])
    
    for element in elements:
        try:
            element_text = element.get_text().strip()
            if not element_text and element.name != 'div':
                continue
            
            if element.name.startswith('h') and element.name[1:].isdigit():
                # Handle headings
                level = int(element.name[1])
                level = min(level, 9)
                text = element.get_text().strip()
                if text:
                    doc.add_heading(text, level)
                    
            elif element.name == 'p':
                # Handle paragraphs with comprehensive formatting
                if element_text:
                    paragraph = doc.add_paragraph()
                    apply_docx_formatting(paragraph, element)
                    apply_paragraph_alignment(paragraph, element)
                    
            elif element.name in ['ul', 'ol']:
                # Handle lists
                for li in element.find_all('li', recursive=False):
                    text = li.get_text().strip()
                    if text:
                        paragraph = doc.add_paragraph(style='List Bullet')
                        apply_docx_formatting(paragraph, li)
                        
            elif element.name == 'blockquote':
                # Handle blockquotes
                if element_text:
                    paragraph = doc.add_paragraph()
                    apply_docx_formatting(paragraph, element)
                    # Make blockquote italic
                    for run in paragraph.runs:
                        run.italic = True
                        
            elif element.name == 'div':
                if 'page-break' in str(element.get('class', [])):
                    doc.add_page_break()
                else:
                    # Handle div with text content
                    if element_text:
                        paragraph = doc.add_paragraph()
                        apply_docx_formatting(paragraph, element)
                        apply_paragraph_alignment(paragraph, element)
                        
        except Exception as e:
            print(f"Error processing DOCX element {element.name}: {e}")
            continue

def apply_docx_formatting(paragraph, element):
    """Apply comprehensive formatting to DOCX paragraph"""
    from docx.shared import Pt
    
    # Process all content including nested formatting
    for content in element.contents:
        if hasattr(content, 'name') and content.name:
            run = paragraph.add_run(content.get_text())
            apply_run_formatting(run, content)
        else:
            # Plain text
            text = str(content).strip()
            if text:
                run = paragraph.add_run(text)
                apply_element_formatting(run, element)

def apply_run_formatting(run, element):
    """Apply formatting to a specific run based on element"""
    from docx.shared import Pt
    
    # Check element name and classes
    classes = str(element.get('class', []))
    
    # Bold
    if element.name in ['strong', 'b'] or 'ql-bold' in classes:
        run.bold = True
    
    # Italic
    if element.name in ['em', 'i'] or 'ql-italic' in classes:
        run.italic = True
    
    # Underline
    if element.name == 'u' or 'ql-underline' in classes:
        run.underline = True
    
    # Strikethrough
    if element.name == 's' or 'ql-strike' in classes:
        run.font.strike = True
    
    # Subscript/Superscript
    if element.name == 'sub' or ('ql-script' in classes and 'sub' in str(element.get('value', ''))):
        run.font.subscript = True
    elif element.name == 'sup' or ('ql-script' in classes and 'super' in str(element.get('value', ''))):
        run.font.superscript = True
    
    # Font size based on Quill classes
    if 'ql-size-small' in classes:
        run.font.size = Pt(10)
    elif 'ql-size-large' in classes:
        run.font.size = Pt(16)
    elif 'ql-size-huge' in classes:
        run.font.size = Pt(20)

def apply_element_formatting(run, element):
    """Apply formatting based on element's own classes"""
    from docx.shared import Pt
    
    classes = str(element.get('class', []))
    
    # Size classes
    if 'ql-size-small' in classes:
        run.font.size = Pt(10)
    elif 'ql-size-large' in classes:
        run.font.size = Pt(16)
    elif 'ql-size-huge' in classes:
        run.font.size = Pt(20)

def apply_paragraph_alignment(paragraph, element):
    """Apply paragraph alignment based on Quill classes"""
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    
    classes = str(element.get('class', []))
    
    if 'ql-align-center' in classes:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    elif 'ql-align-right' in classes:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    elif 'ql-align-justify' in classes:
        paragraph.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

def escape_html(text):
    """Escape HTML special characters"""
    if not text:
        return ""
    return (str(text)
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
            .replace("'", '&#39;'))

def extract_body_content(html_content):
    """Extract content from HTML body, preserving structure"""
    try:
        # Remove style and script tags
        html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL)
        html_content = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
        
        # Extract body content
        body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL)
        if body_match:
            return body_match.group(1)
        else:
            # If no body tag, return the content as is
            return html_content
    except Exception as e:
        print(f"Error extracting body content: {e}")
        return html_content

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