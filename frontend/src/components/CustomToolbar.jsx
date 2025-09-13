import { useEffect, useState } from 'react';
import '../styles/MobileTool.css';
import '../styles/CustomToolbar.css';
import { 
  Undo2, 
  Redo2, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Rows3, 
  Strikethrough, 
  Quote, 
  List, 
  ListOrdered, 
  Save, 
  Diff,  
  ArrowLeft,
  ArrowRight,
  Link,
  Image,
  Video,
  Code,
  Eraser,
  FilePlus
} from 'lucide-react';

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
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  // Essential formatting handlers
  const handleBoldClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const isBold = quillInstance.getFormat().bold;
      quillInstance.format('bold', !isBold);
    }
  };

  const handleItalicClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const isItalic = quillInstance.getFormat().italic;
      quillInstance.format('italic', !isItalic);
    }
  };

  const handleUnderlineClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const isUnderline = quillInstance.getFormat().underline;
      quillInstance.format('underline', !isUnderline);
    }
  };

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

      // Wait for toolbar to be rendered
      const timer = setTimeout(() => {
        // Desktop toolbar buttons
        const undoButton = document.querySelector('.ql-undo');
        const redoButton = document.querySelector('.ql-redo');
        
        if (undoButton) {
          undoButton.removeAttribute('data-role');
          undoButton.addEventListener('click', handleUndoClick);
        }
        
        if (redoButton) {
          redoButton.removeAttribute('data-role');
          redoButton.addEventListener('click', handleRedoClick);
        }

        // Mobile essential toolbar buttons
        const mobileUndoBtn = document.querySelector('.mobile-essential .mobile-undo');
        const mobileRedoBtn = document.querySelector('.mobile-essential .mobile-redo');
        const mobileBoldBtn = document.querySelector('.mobile-essential .mobile-bold');
        const mobileItalicBtn = document.querySelector('.mobile-essential .mobile-italic');
        const mobileUnderlineBtn = document.querySelector('.mobile-essential .mobile-underline');

        if (mobileUndoBtn) mobileUndoBtn.addEventListener('click', handleUndoClick);
        if (mobileRedoBtn) mobileRedoBtn.addEventListener('click', handleRedoClick);
        if (mobileBoldBtn) mobileBoldBtn.addEventListener('click', handleBoldClick);
        if (mobileItalicBtn) mobileItalicBtn.addEventListener('click', handleItalicClick);
        if (mobileUnderlineBtn) mobileUnderlineBtn.addEventListener('click', handleUnderlineClick);
      }, 200);

      return () => {
        clearTimeout(timer);
        // Clean up event listeners
        const undoButton = document.querySelector('.ql-undo');
        const redoButton = document.querySelector('.ql-redo');
        
        if (undoButton) undoButton.removeEventListener('click', handleUndoClick);
        if (redoButton) redoButton.removeEventListener('click', handleRedoClick);

        // Clean up mobile essential toolbar listeners
        const mobileButtons = document.querySelectorAll('.mobile-essential button');
        mobileButtons.forEach(btn => {
          btn.removeEventListener('click', handleUndoClick);
          btn.removeEventListener('click', handleRedoClick);
          btn.removeEventListener('click', handleBoldClick);
          btn.removeEventListener('click', handleItalicClick);
          btn.removeEventListener('click', handleUnderlineClick);
        });
      };
    }
  }, [quillInstance]);

  // Advanced mobile toolbar handlers
  const handleFontChange = (e) => {
    if (quillInstance) {
      const font = e.target.value;
      quillInstance.format('font', font || false);
    }
  };

  const handleSizeChange = (e) => {
    if (quillInstance) {
      const size = e.target.value;
      quillInstance.format('size', size || false);
    }
  };

  const handleAlignChange = (value) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      quillInstance.format('align', value || false);
    }
  };

  const handleHeaderChange = (e) => {
    if (quillInstance) {
      const header = e.target.value;
      quillInstance.format('header', header || false);
    }
  };

  const handleColorChange = (e) => {
    if (quillInstance) {
      const color = e.target.value;
      quillInstance.format('color', color || false);
    }
  };

  const handleStrikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const isStrike = quillInstance.getFormat().strike;
      quillInstance.format('strike', !isStrike);
    }
  };

  const handleListClick = (listType) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const currentList = quillInstance.getFormat().list;
      quillInstance.format('list', currentList === listType ? false : listType);
    }
  };

  const handleQuoteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const isQuote = quillInstance.getFormat().blockquote;
      quillInstance.format('blockquote', !isQuote);
    }
  };

  const handleSubscriptClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      quillInstance.format('script', 'sub');
    }
  };

  const handleSuperscriptClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      quillInstance.format('script', 'super');
    }
  };

  const handleBackgroundChange = (e) => {
    if (quillInstance) {
      const background = e.target.value;
      quillInstance.format('background', background || false);
    }
  };

  const handleIndentDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      quillInstance.format('indent', '-1');
    }
  };

  const handleIndentIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      quillInstance.format('indent', '+1');
    }
  };

  const handleDirectionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const current = quillInstance.getFormat().direction;
      quillInstance.format('direction', current === 'rtl' ? false : 'rtl');
    }
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const url = prompt('Enter link URL:');
      if (url) {
        quillInstance.format('link', url);
      }
    }
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const url = prompt('Enter image URL:');
      if (url) {
        const range = quillInstance.getSelection() || { index: 0 };
        quillInstance.insertEmbed(range.index, 'image', url);
      }
    }
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const url = prompt('Enter video URL:');
      if (url) {
        const range = quillInstance.getSelection() || { index: 0 };
        quillInstance.insertEmbed(range.index, 'video', url);
      }
    }
  };

  const handleCodeBlockClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const isCode = quillInstance.getFormat()['code-block'];
      quillInstance.format('code-block', !isCode);
    }
  };

  const handleCleanClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const range = quillInstance.getSelection();
      if (range) {
        quillInstance.removeFormat(range.index, range.length);
      }
    }
  };

  const handleNewPageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quillInstance) {
      const range = quillInstance.getSelection();
      if (range) {
        quillInstance.insertEmbed(range.index, 'page-break', true);
        quillInstance.setSelection(range.index + 1);
        quillInstance.insertText(range.index + 1, '\n\n\n');
        quillInstance.setSelection(range.index + 4);
        quillInstance.focus();
      }
    }
  };

  return (
    <>
      {/* Desktop Toolbar - Hidden on Mobile */}
      <div className="toolbar-wrapper desktop-only">
        <div className="toolbar-container">
          <div id="toolbar" className="ql-toolbar ql-snow">
            <span className="ql-formats">
              <button className="ql-undo custom-undo" type="button" title="Undo" data-custom="undo">↶</button>
              <button className="ql-redo custom-redo" type="button" title="Redo" data-custom="redo">↷</button>
              {/* <button className="ql-new-page" type="button" title="Add Page">📄</button> */}
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
            {/* <span className="ql-formats">
              <input
                type="number"
                className="ql-page-width"
                title="Page Width (px)"
                value={pageWidth}
                onChange={(e) => setPageWidth(Number(e.target.value))}
                min="400"
                max="1200"
                style={{ width: '80px', padding: '4px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#e2e8f0', border: 'none', fontSize: '12px' }}
              />
            </span>
            <span className="ql-formats">
              <select
                className="ql-output-format"
                title="Output Format"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
              >
                <option value="html">HTML</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
            </span>
            <span className="ql-formats">
              <button
                className="ql-save"
                type="button"
                title="Save Document"
                onClick={onDownload}
                disabled={isDownloading}
              >
                {isDownloading ? '⏳' : '💾'}
              </button>
            </span> */}
          </div>
        </div>
      </div>

      {/* Mobile Toolbar - Bottom Fixed Position */}
      <div className="mobile-toolbar-container mobile-only">
        {/* Essential Tools Row */}
        <div className="mobile-essential-toolbar">
          <div className="mobile-essential">
            <div className="tool-item">
              <button className="mobile-undo" type="button" title="Undo">↶</button>
              <span className="tool-label">Undo</span>
            </div>
            <div className="tool-item">
              <button className="mobile-redo" type="button" title="Redo">↷</button>
              <span className="tool-label">Redo</span>
            </div>
            <div className="tool-item">
              <button 
                className={`mobile-bold ${activeFormats.bold ? 'active' : ''}`} 
                type="button" 
                title="Bold"
                onClick={handleBoldClick}
              >B</button>
              <span className="tool-label">Bold</span>
            </div>
            <div className="tool-item">
              <button 
                className={`mobile-italic ${activeFormats.italic ? 'active' : ''}`} 
                type="button" 
                title="Italic"
                onClick={handleItalicClick}
              >I</button>
              <span className="tool-label">Italic</span>
            </div>
            <div className="tool-item">
              <button 
                className={`mobile-underline ${activeFormats.underline ? 'active' : ''}`} 
                type="button" 
                title="Underline"
                onClick={handleUnderlineClick}
              >U</button>
              <span className="tool-label">Underline</span>
            </div>
            <div className="tool-item">
              <button 
                className="mobile-save-button"
                onClick={onDownload}
                disabled={isDownloading}
                title="Save Document"
              >
                {isDownloading ? '⏳' : <Save size={28} />}
              </button>
              <span className="tool-label">Save</span>
            </div>
            <div className="tool-item">
              <button 
                className={`modern-show-button ${showAdvancedTools ? 'active' : ''}`}
                onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                title={showAdvancedTools ? "Hide Advanced Tools" : "Show Advanced Tools"}
              >
                <Diff size={28} />
              </button>
              <span className="tool-label">{showAdvancedTools ? "Hide" : "Show"}</span>
            </div>
          </div>
        </div>

        {/* Advanced Tools Section - Expandable */}
        {showAdvancedTools && (
          <div className="mobile-advanced-section">
            <div className="advanced-tools-row">
              <div className="tool-item">
                <button 
                  className="tool-button" 
                  type="button" 
                  title="Undo"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    quillInstance.history.undo(); 
                  }}
                >
                  <Undo2 size={24} />
                </button>
                <span className="tool-label">Undo</span>
              </div>
              <div className="tool-item">
                <button 
                  className="tool-button" 
                  type="button" 
                  title="Redo"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    quillInstance.history.redo(); 
                  }}
                >
                  <Redo2 size={24} />
                </button>
                <span className="tool-label">Redo</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <select 
                  className="tool-select" 
                  onChange={handleFontChange} 
                  value={activeFormats.font || ''} 
                  title="Font Family"
                >
                  <option value="">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
                <span className="tool-label">Font</span>
              </div>
              <div className="tool-item">
                <select 
                  className="tool-select" 
                  onChange={handleSizeChange} 
                  value={activeFormats.size || ''} 
                  title="Font Size"
                >
                  <option value="small">Small</option>
                  <option value="">Normal</option>
                  <option value="large">Large</option>
                  <option value="huge">Huge</option>
                </select>
                <span className="tool-label">Size</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <select 
                  className="tool-select" 
                  onChange={handleHeaderChange} 
                  value={activeFormats.header || ''} 
                  title="Heading Level"
                >
                  <option value="">Normal</option>
                  <option value="1">H1</option>
                  <option value="2">H2</option>
                  <option value="3">H3</option>
                  <option value="4">H4</option>
                  <option value="5">H5</option>
                  <option value="6">H6</option>
                </select>
                <span className="tool-label">Header</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.bold ? 'active' : ''}`} 
                  type="button" 
                  title="Bold"
                  onClick={handleBoldClick}
                >
                  <Bold size={24} />
                </button>
                <span className="tool-label">Bold</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.italic ? 'active' : ''}`} 
                  type="button" 
                  title="Italic"
                  onClick={handleItalicClick}
                >
                  <Italic size={24} />
                </button>
                <span className="tool-label">Italic</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.underline ? 'active' : ''}`} 
                  type="button" 
                  title="Underline"
                  onClick={handleUnderlineClick}
                >
                  <Underline size={24} />
                </button>
                <span className="tool-label">Underline</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.strike ? 'active' : ''}`} 
                  type="button" 
                  title="Strike Through"
                  onClick={handleStrikeClick}
                >
                  <Strikethrough size={24} />
                </button>
                <span className="tool-label">Strike</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.script === 'sub' ? 'active' : ''}`} 
                  type="button" 
                  title="Subscript"
                  onClick={handleSubscriptClick}
                >
                  X₂
                </button>
                <span className="tool-label">Sub</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.script === 'super' ? 'active' : ''}`} 
                  type="button" 
                  title="Superscript"
                  onClick={handleSuperscriptClick}
                >
                  X²
                </button>
                <span className="tool-label">Sup</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <input
                  type="color"
                  onChange={handleColorChange}
                  value={activeFormats.color || '#000000'}
                  className="color-input"
                  title="Text Color"
                />
                <span className="tool-label">Color</span>
              </div>
              <div className="tool-item">
                <input
                  type="color"
                  onChange={handleBackgroundChange}
                  value={activeFormats.background || '#ffffff'}
                  className="color-input"
                  title="Background Color"
                />
                <span className="tool-label">BG</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.list === 'ordered' ? 'active' : ''}`} 
                  type="button" 
                  title="Numbered List"
                  onClick={handleListClick('ordered')}
                >
                  <ListOrdered size={24} />
                </button>
                <span className="tool-label">Numbered</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.list === 'bullet' ? 'active' : ''}`} 
                  type="button" 
                  title="Bullet List"
                  onClick={handleListClick('bullet')}
                >
                  <List size={24} />
                </button>
                <span className="tool-label">Bullet</span>
              </div>
              <div className="tool-item">
                <button 
                  className="tool-button" 
                  type="button" 
                  title="Decrease Indent"
                  onClick={handleIndentDecrease}
                >
                  <ArrowLeft size={24} />
                </button>
                <span className="tool-label">Indent -</span>
              </div>
              <div className="tool-item">
                <button 
                  className="tool-button" 
                  type="button" 
                  title="Increase Indent"
                  onClick={handleIndentIncrease}
                >
                  <ArrowRight size={24} />
                </button>
                <span className="tool-label">Indent +</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.align === '' ? 'active' : ''}`} 
                  type="button" 
                  title="Align Left"
                  onClick={handleAlignChange('')}
                >
                  <AlignLeft size={24} />
                </button>
                <span className="tool-label">Left</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.align === 'center' ? 'active' : ''}`} 
                  type="button" 
                  title="Align Center"
                  onClick={handleAlignChange('center')}
                >
                  <AlignCenter size={24} />
                </button>
                <span className="tool-label">Center</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.align === 'right' ? 'active' : ''}`} 
                  type="button" 
                  title="Align Right"
                  onClick={handleAlignChange('right')}
                >
                  <AlignRight size={24} />
                </button>
                <span className="tool-label">Right</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.align === 'justify' ? 'active' : ''}`} 
                  type="button" 
                  title="Align Justify"
                  onClick={handleAlignChange('justify')}
                >
                  <AlignJustify size={24} />
                </button>
                <span className="tool-label">Justify</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.direction === 'rtl' ? 'active' : ''}`} 
                  type="button" 
                  title="Text Direction"
                  onClick={handleDirectionClick}
                >
                  ↔
                </button>
                <span className="tool-label">Dir</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <button 
                  className="tool-button" 
                  type="button" 
                  title="Insert Link"
                  onClick={handleLinkClick}
                >
                  <Link size={24} />
                </button>
                <span className="tool-label">Link</span>
              </div>
              <div className="tool-item">
                <button 
                  className="tool-button" 
                  type="button" 
                  title="Insert Image"
                  onClick={handleImageClick}
                >
                  <Image size={24} />
                </button>
                <span className="tool-label">Image</span>
              </div>
              <div className="tool-item">
                <button 
                  className="tool-button" 
                  type="button" 
                  title="Insert Video"
                  onClick={handleVideoClick}
                >
                  <Video size={24} />
                </button>
                <span className="tool-label">Video</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats.blockquote ? 'active' : ''}`} 
                  type="button" 
                  title="Quote"
                  onClick={handleQuoteClick}
                >
                  <Quote size={24} />
                </button>
                <span className="tool-label">Quote</span>
              </div>
              <div className="tool-item">
                <button 
                  className={`tool-button ${activeFormats['code-block'] ? 'active' : ''}`} 
                  type="button" 
                  title="Code Block"
                  onClick={handleCodeBlockClick}
                >
                  <Code size={24} />
                </button>
                <span className="tool-label">Code</span>
              </div>
              <hr className="tool-divider" />
              <div className="tool-item">
                <button 
                  className="tool-button" 
                  type="button" 
                  title="Clear Formatting"
                  onClick={handleCleanClick}
                >
                  <Eraser size={24} />
                </button>
                <span className="tool-label">Clean</span>
              </div>
              <hr className="tool-divider" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomToolbar;