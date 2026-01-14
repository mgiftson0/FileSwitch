import { useState } from 'react';
import CustomToolbar from '../components/CustomToolbar';
import EditorContainer from '../components/EditorContainer';
import ControlPanel from '../components/ControlPanel';
import Footer from '../components/Footer';
import '../styles/TextEditorPage.css';

const TextEditorPage = () => {
  const [text, setText] = useState('');
  const [documentName, setDocumentName] = useState('Untitled Document');
  const [pageWidth, setPageWidth] = useState(816);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [quillInstance, setQuillInstance] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // API base URL - updated to your Render backend
  const API_BASE_URL = 'https://fileswitch-8zjy.onrender.com';

  // Function to get raw HTML from Quill editor preserving all formatting
  const getFormattedHTML = () => {
    if (quillInstance) {
      // Get the raw HTML content directly from Quill
      const editorHTML = quillInstance.root.innerHTML;
      console.log('Raw Quill HTML:', editorHTML); // Debug log
      return editorHTML;
    }
    return text;
  };

  // Function to convert HTML to a properly formatted document
  const convertToFormattedContent = (html) => {
    // Enhanced HTML with comprehensive CSS for all Quill formatting
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${documentName}</title>
<style>
body { 
  font-family: 'Times New Roman', serif; 
  line-height: 1.6; 
  margin: 40px; 
  color: #000;
  font-size: 14px;
}

/* Headings */
h1, .ql-header-1 { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
h2, .ql-header-2 { font-size: 20px; font-weight: bold; margin-bottom: 12px; }
h3, .ql-header-3 { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
h4, .ql-header-4 { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
h5, .ql-header-5 { font-size: 14px; font-weight: bold; margin-bottom: 6px; }
h6, .ql-header-6 { font-size: 12px; font-weight: bold; margin-bottom: 4px; }

/* Basic formatting */
p { margin-bottom: 12px; }
strong, .ql-bold, b { font-weight: bold !important; }
em, .ql-italic, i { font-style: italic !important; }
u, .ql-underline { text-decoration: underline !important; }
s, .ql-strike { text-decoration: line-through !important; }

/* Font sizes */
.ql-size-small { font-size: 10px !important; }
.ql-size-large { font-size: 18px !important; }
.ql-size-huge { font-size: 24px !important; }

/* Font families */
.ql-font-serif { font-family: serif !important; }
.ql-font-monospace { font-family: monospace !important; }

/* Text alignment */
.ql-align-center { text-align: center !important; }
.ql-align-right { text-align: right !important; }
.ql-align-justify { text-align: justify !important; }

/* Lists */
ul, ol { margin-left: 20px; margin-bottom: 12px; }
li { margin-bottom: 4px; }
.ql-list-ordered { list-style-type: decimal; }
.ql-list-bullet { list-style-type: disc; }

/* Blockquotes */
blockquote { 
  border-left: 4px solid #ddd; 
  padding-left: 16px; 
  margin: 16px 0; 
  font-style: italic; 
}

/* Subscript and Superscript */
sub, .ql-script-sub { vertical-align: sub; font-size: 0.8em; }
sup, .ql-script-super { vertical-align: super; font-size: 0.8em; }

/* Code blocks */
.ql-code-block { 
  background-color: #f5f5f5; 
  padding: 10px; 
  border-radius: 4px; 
  font-family: monospace; 
  margin: 10px 0; 
}

/* Page breaks */
.page-break { page-break-before: always; }

/* Links */
a { color: #0066cc; text-decoration: underline; }

/* Colors - these will be handled dynamically */
.ql-color-red { color: red !important; }
.ql-color-blue { color: blue !important; }
.ql-color-green { color: green !important; }
.ql-color-orange { color: orange !important; }
.ql-color-purple { color: purple !important; }
.ql-color-yellow { color: #yellow !important; }

/* Background colors */
.ql-bg-red { background-color: red !important; }
.ql-bg-blue { background-color: blue !important; }
.ql-bg-green { background-color: green !important; }
.ql-bg-orange { background-color: orange !important; }
.ql-bg-purple { background-color: purple !important; }
.ql-bg-yellow { background-color: yellow !important; }

/* Indentation */
.ql-indent-1 { padding-left: 3em; }
.ql-indent-2 { padding-left: 6em; }
.ql-indent-3 { padding-left: 9em; }
.ql-indent-4 { padding-left: 12em; }
.ql-indent-5 { padding-left: 15em; }

/* RTL Direction */
.ql-direction-rtl { direction: rtl; text-align: right; }
</style>
</head>
<body>
${html}
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

      // Get the formatted HTML directly from Quill editor
      const formattedHTML = getFormattedHTML();
      console.log('Formatted HTML being sent:', formattedHTML); // Debug log

      if (outputFormat === 'pdf') {
        // For PDF: Create properly formatted HTML file
        const htmlContent = convertToFormattedContent(formattedHTML);
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const htmlFile = new File([htmlBlob], `${documentName}.html`, { type: 'text/html' });

        formData.append('file', htmlFile);
        formData.append('type', 'html_to_pdf');
      } else if (outputFormat === 'docx') {
        // For Word: Also use HTML content to preserve formatting
        const htmlContent = convertToFormattedContent(formattedHTML);
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const htmlFile = new File([htmlBlob], `${documentName}.html`, { type: 'text/html' });

        formData.append('file', htmlFile);
        formData.append('type', 'text_to_docx');
      }

      // Updated API URL
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.converted_id) {
        // Updated download URL
        const downloadResponse = await fetch(`${API_BASE_URL}/download/${result.converted_id}`);

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

  return (
    <div className="text-editor-page">
      <ControlPanel
        documentName={documentName}
        setDocumentName={setDocumentName}
        pageWidth={pageWidth}
        setPageWidth={setPageWidth}
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        handleDownload={handleDownload}
        isDownloading={isDownloading}
        handleBack={handleBack}
      />

      <CustomToolbar
        quillInstance={quillInstance}
        documentName={documentName}
        setDocumentName={setDocumentName}
        pageWidth={pageWidth}
        setPageWidth={setPageWidth}
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />

      <EditorContainer
        text={text}
        setText={setText}
        pageWidth={pageWidth}
        setQuillInstance={setQuillInstance}
      />
      <Footer />
    </div>
  );
};

export default TextEditorPage;
