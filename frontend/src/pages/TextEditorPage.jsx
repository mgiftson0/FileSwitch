import { useState } from 'react';
import CustomToolbar from '../components/CustomToolbar';
import EditorContainer from '../components/EditorContainer';
import ControlPanel from '../components/ControlPanel';
// import Footer from '../components/Footer';
import '../components/TextEditorPage.css';

const TextEditorPage = () => {
  const [text, setText] = useState('');
  const [documentName, setDocumentName] = useState('Untitled Document');
  const [pageWidth, setPageWidth] = useState(816);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [quillInstance, setQuillInstance] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to convert Quill HTML to plain text for Word conversion
  const convertToPlainText = (html) => {
    // Create a temporary div to parse HTML
    const div = document.createElement('div');
    div.innerHTML = html;
    
    // Remove page break elements for cleaner text
    const pageBreaks = div.querySelectorAll('.page-break');
    pageBreaks.forEach(pb => pb.remove());
    
    return div.textContent || div.innerText || '';
  };

  // Function to convert HTML to a simple Word-compatible format
  const convertToWordContent = (html) => {
    // Basic HTML cleanup for Word compatibility
    let content = html;
    
    // Replace Quill classes with basic HTML
    content = content.replace(/class="[^"]*"/g, '');
    content = content.replace(/<div class="page-break">.*?<\/div>/g, '<div style="page-break-before: always;"></div>');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${documentName}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
          h1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
          h2 { font-size: 20px; font-weight: bold; margin-bottom: 12px; }
          h3 { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
          p { margin-bottom: 12px; }
          strong { font-weight: bold; }
          em { font-style: italic; }
          ul, ol { margin-left: 20px; margin-bottom: 12px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
  };

  const handleDownload = async () => {
    if (!text.trim()) {
      alert('Please add some content before downloading.');
      return;
    }

    setIsDownloading(true);

    try {
      const formData = new FormData();
      
      if (outputFormat === 'pdf') {
        // For PDF: Create HTML file and convert via backend
        const htmlContent = convertToWordContent(text);
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const htmlFile = new File([htmlBlob], `${documentName}.html`, { type: 'text/html' });
        
        formData.append('file', htmlFile);
        formData.append('type', 'html_to_pdf');
      } else if (outputFormat === 'docx') {
        // For Word: Create a simple text file first
        const plainText = convertToPlainText(text);
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        const textFile = new File([textBlob], `${documentName}.txt`, { type: 'text/plain' });
        
        formData.append('file', textFile);
        formData.append('type', 'text_to_docx');
      }

      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.converted_id) {
        // Download the converted file
        const downloadResponse = await fetch(`http://127.0.0.1:5000/download/${result.converted_id}`);
        
        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${documentName}.${outputFormat === 'pdf' ? 'pdf' : 'docx'}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          throw new Error('Failed to download converted file');
        }
      } else {
        throw new Error('Conversion failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download document: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBack = () => {
    if (text.trim() && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    window.history.back();
  };

  const pageWidthOptions = [
    { value: 612, label: 'Letter (8.5")' },
    { value: 595, label: 'A4' },
    { value: 816, label: 'Wide (10.5")' },
    { value: 1056, label: 'Legal (13.5")' }
  ];

  return (
    <div className="text-editor-page">
      <div className="control-panel">
        <button className="back-button" onClick={handleBack} title="Go Back">
          ←
        </button>
        
        <div className="control-group">
          <label htmlFor="document-name">Document Name:</label>
          <input
            id="document-name"
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            className="document-name-input"
            placeholder="Enter document name"
          />
        </div>

        <div className="control-group">
          <label htmlFor="page-width">Page Width:</label>
          <select
            id="page-width"
            value={pageWidth}
            onChange={(e) => setPageWidth(Number(e.target.value))}
            className="page-width-select"
          >
            {pageWidthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="output-format">Save As:</label>
          <select
            id="output-format"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="format-select"
          >
            <option value="pdf">PDF Document</option>
            <option value="docx">Word Document</option>
          </select>
        </div>

        <button 
          className="download-button"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? 'Converting...' : `Download ${outputFormat.toUpperCase()}`}
        </button>
      </div>

      <CustomToolbar quillInstance={quillInstance} />
      
      <EditorContainer
        text={text}
        setText={setText}
        pageWidth={pageWidth}
        setQuillInstance={setQuillInstance}
      />
    </div>
  );
};

export default TextEditorPage;