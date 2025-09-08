import { useEffect, useState } from 'react';
import '../components/MobileTool.css';

const CustomToolbar = ({ 
  quillInstance, 
  documentName, 
  setDocumentName, 
  pageWidth, 
  setPageWidth, 
  outputFormat, 
  setOutputFormat, 
  onDownload, 
  isDownloading
}) => {
  const [activeFormats, setActiveFormats] = useState({});

  // Update active formats when selection changes
  useEffect(() => {
    if (quillInstance) {
      const updateFormats = () => {
        const formats = quillInstance.getFormat();
        setActiveFormats(formats);
      };

      quillInstance.on('selection-change', updateFormats);
      quillInstance.on('text-change', updateFormats);

      return () => {
        quillInstance.off('selection-change', updateFormats);
        quillInstance.off('text-change', updateFormats);
      };
    }
  }, [quillInstance]);

  useEffect(() => {
    if (quillInstance) {
      // Add custom handlers for undo/redo buttons with proper event handling
      const handleUndoClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        quillInstance.history.undo();
      };

      const handleRedoClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        quillInstance.history.redo();
      };

      // Mobile toolbar handlers
      const handleMobileBoldClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isBold = quillInstance.getFormat().bold;
        quillInstance.format('bold', !isBold);
      };

      const handleMobileItalicClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isItalic = quillInstance.getFormat().italic;
        quillInstance.format('italic', !isItalic);
      };

      const handleMobileUnderlineClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isUnderline = quillInstance.getFormat().underline;
        quillInstance.format('underline', !isUnderline);
      };

      // Wait for toolbar to be rendered
      const timer = setTimeout(() => {
        const undoButton = document.querySelector('.ql-undo');
        const redoButton = document.querySelector('.ql-redo');
        
        if (undoButton) {
          // Remove any existing listeners and add new one
          undoButton.removeAttribute('data-role');
          undoButton.addEventListener('click', handleUndoClick);
        }
        
        if (redoButton) {
          // Remove any existing listeners and add new one
          redoButton.removeAttribute('data-role');
          redoButton.addEventListener('click', handleRedoClick);
        }

        // Mobile toolbar buttons
        const mobileBoldBtn = document.querySelector('.mobile-toolbar-top .mobile-bold');
        const mobileItalicBtn = document.querySelector('.mobile-toolbar-top .mobile-italic');
        const mobileUnderlineBtn = document.querySelector('.mobile-toolbar-top .mobile-underline');
        const mobileUndoBtn = document.querySelector('.mobile-toolbar-top .mobile-undo');
        const mobileRedoBtn = document.querySelector('.mobile-toolbar-top .mobile-redo');

        if (mobileBoldBtn) mobileBoldBtn.addEventListener('click', handleMobileBoldClick);
        if (mobileItalicBtn) mobileItalicBtn.addEventListener('click', handleMobileItalicClick);
        if (mobileUnderlineBtn) mobileUnderlineBtn.addEventListener('click', handleMobileUnderlineClick);
        if (mobileUndoBtn) mobileUndoBtn.addEventListener('click', handleUndoClick);
        if (mobileRedoBtn) mobileRedoBtn.addEventListener('click', handleRedoClick);
      }, 100);

      return () => {
        clearTimeout(timer);
        // Clean up event listeners
        const undoButton = document.querySelector('.ql-undo');
        const redoButton = document.querySelector('.ql-redo');
        
        if (undoButton) {
          undoButton.removeEventListener('click', handleUndoClick);
        }
        if (redoButton) {
          redoButton.removeEventListener('click', handleRedoClick);
        }

        // Clean up mobile toolbar listeners
        const mobileButtons = document.querySelectorAll('.mobile-toolbar-top button');
        mobileButtons.forEach(btn => {
          btn.removeEventListener('click', handleMobileBoldClick);
          btn.removeEventListener('click', handleMobileItalicClick);
          btn.removeEventListener('click', handleMobileUnderlineClick);
          btn.removeEventListener('click', handleUndoClick);
          btn.removeEventListener('click', handleRedoClick);
        });
      };
    }
  }, [quillInstance]);

  // Mobile toolbar select handlers
  const handleMobileFontChange = (e) => {
    if (quillInstance) {
      const font = e.target.value;
      quillInstance.format('font', font || false);
    }
  };

  const handleMobileSizeChange = (e) => {
    if (quillInstance) {
      const size = e.target.value;
      quillInstance.format('size', size || false);
    }
  };

  const handleMobileAlignChange = (e) => {
    if (quillInstance) {
      const align = e.target.value;
      quillInstance.format('align', align || false);
    }
  };

  return (
    <>
      {/* Main Desktop Toolbar */}
      <div className="toolbar-wrapper">
        <div className="toolbar-container">
          <div id="toolbar" className="ql-toolbar ql-snow">
            <span className="ql-formats">
              {/* Remove ql-undo and ql-redo classes to prevent Quill from trying to bind them */}
              <button className="ql-undo custom-undo" type="button" title="Undo" data-custom="undo">↶</button>
              <button className="ql-redo custom-redo" type="button" title="Redo" data-custom="redo">↷</button>
              <button className="ql-new-page" type="button" title="Add Page">📄</button>
              <button className="ql-page-break" type="button" title="Page Break">📑</button>
            </span>
            <span className="ql-formats">
              <select className="ql-font" title="Font Family" defaultValue="">
                <option value="">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
              <select className="ql-size" title="Font Size" defaultValue="">
                <option value="small">Small</option>
                <option value="">Normal</option>
                <option value="large">Large</option>
                <option value="huge">Huge</option>
              </select>
            </span>
            <span className="ql-formats">
              <select className="ql-header" title="Heading Level" defaultValue="">
                <option value="">Normal</option>
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="4">H4</option>
                <option value="5">H5</option>
                <option value="6">H6</option>
              </select>
            </span>
            <span className="ql-formats">
              <button className="ql-bold" type="button" title="Bold">B</button>
              <button className="ql-italic" type="button" title="Italic">I</button>
              <button className="ql-underline" type="button" title="Underline">U</button>
              <button className="ql-strike" type="button" title="Strike">S</button>
            </span>
            <span className="ql-formats">
              <button className="ql-script" value="sub" type="button" title="Subscript">X₂</button>
              <button className="ql-script" value="super" type="button" title="Superscript">X²</button>
            </span>
            <span className="ql-formats">
              <select className="ql-color" title="Text Color"></select>
              <select className="ql-background" title="Background Color"></select>
            </span>
            <span className="ql-formats">
              <button className="ql-list" value="ordered" type="button" title="Numbered List">1.</button>
              <button className="ql-list" value="bullet" type="button" title="Bullet List">•</button>
              <button className="ql-indent" value="-1" type="button" title="Decrease Indent">⬅</button>
              <button className="ql-indent" value="+1" type="button" title="Increase Indent">➡</button>
            </span>
            <span className="ql-formats">
              <select className="ql-align" title="Text Alignment" defaultValue="">
                <option value="">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </select>
              <button className="ql-direction" value="rtl" type="button" title="Text Direction">↔</button>
            </span>
            <span className="ql-formats">
              <button className="ql-link" type="button" title="Insert Link">🔗</button>
              <button className="ql-image" type="button" title="Insert Image">🖼</button>
              <button className="ql-video" type="button" title="Insert Video">🎥</button>
            </span>
            <span className="ql-formats">
              <button className="ql-blockquote" type="button" title="Quote">"</button>
              <button className="ql-code-block" type="button" title="Code Block">{`</>`}</button>
            </span>
            <span className="ql-formats">
              <button className="ql-clean" type="button" title="Clear Formatting">🧹</button>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Toolbar - Top */}
    {/* Mobile Toolbar - Bottom */}
    <div className="mobile-toolbar-bottom">
      <div className="mobile-controls-row">
        <input
          className="mobile-doc-name"
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Document Name"
        />
        
        <select
          className="mobile-page-width"
          value={pageWidth}
          onChange={(e) => setPageWidth(Number(e.target.value))}
        >
          <option value={612}>Letter</option>
          <option value={595}>A4</option>
          <option value={816}>Wide</option>
          <option value={1056}>Legal</option>
        </select>
        
        <select
          className="mobile-save-format"
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
        >
          <option value="pdf">PDF</option>
          <option value="docx">Word</option>
        </select>
        
        <button 
          className="mobile-download-button"
          onClick={onDownload}
          disabled={isDownloading}
        >
          {isDownloading ? '...' : 'Save'}
        </button>
      </div>
      
      <div className="mobile-editing-row">
        <button className="mobile-undo" type="button" title="Undo">↶</button>
        <button className="mobile-redo" type="button" title="Redo">↷</button>
        <button 
          className={`mobile-bold ${activeFormats.bold ? 'active' : ''}`} 
          type="button" 
          title="Bold"
        >
          B
        </button>
        <button 
          className={`mobile-italic ${activeFormats.italic ? 'active' : ''}`} 
          type="button" 
          title="Italic"
        >
          I
        </button>
        <button 
          className={`mobile-underline ${activeFormats.underline ? 'active' : ''}`} 
          type="button" 
          title="Underline"
        >
          U
        </button>
        
        <select 
          className="mobile-font" 
          onChange={handleMobileFontChange} 
          value={activeFormats.font || ''}
          title="Font"
        >
          <option value="">Sans</option>
          <option value="serif">Serif</option>
          <option value="monospace">Mono</option>
        </select>
        
        <select 
          className="mobile-size" 
          onChange={handleMobileSizeChange} 
          value={activeFormats.size || ''}
          title="Size"
        >
          <option value="small">S</option>
          <option value="">M</option>
          <option value="large">L</option>
          <option value="huge">XL</option>
        </select>
      </div>
    </div>
  </>
);
};

export default CustomToolbar;