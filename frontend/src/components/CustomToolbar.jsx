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
  const [advancedPage, setAdvancedPage] = useState(0); // 0 = Page 1 (Text), 1 = Page 2 (Paragraph)

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

        // Connect desktop toolbar handlers
        const connectDesktopHandlers = () => {
          // Font family
          const fontSelect = document.querySelector('.ql-font');
          if (fontSelect) {
            fontSelect.onchange = (e) => {
              const font = e.target.value;
              quillInstance.format('font', font || false);
            };
          }

          // Font size
          const sizeSelect = document.querySelector('.ql-size');
          if (sizeSelect) {
            sizeSelect.onchange = (e) => {
              const size = e.target.value;
              quillInstance.format('size', size || false);
            };
          }

          // Header
          const headerSelect = document.querySelector('.ql-header');
          if (headerSelect) {
            headerSelect.onchange = (e) => {
              const header = e.target.value;
              quillInstance.format('header', header || false);
            };
          }

          // Script (subscript/superscript)
          const scriptButtons = document.querySelectorAll('.ql-script');
          scriptButtons.forEach(button => {
            button.onclick = (e) => {
              const value = button.getAttribute('value');
              quillInstance.format('script', value);
            };
          });

          // Color
          const colorSelect = document.querySelector('.ql-color');
          if (colorSelect) {
            colorSelect.onchange = (e) => {
              const color = e.target.value;
              quillInstance.format('color', color || false);
            };
          }

          // Background
          const backgroundSelect = document.querySelector('.ql-background');
          if (backgroundSelect) {
            backgroundSelect.onchange = (e) => {
              const background = e.target.value;
              quillInstance.format('background', background || false);
            };
          }

          // Lists
          const listButtons = document.querySelectorAll('.ql-list');
          listButtons.forEach(button => {
            button.onclick = (e) => {
              const value = button.getAttribute('value');
              const currentList = quillInstance.getFormat().list;
              quillInstance.format('list', currentList === value ? false : value);
            };
          });

          // Indent
          const indentButtons = document.querySelectorAll('.ql-indent');
          indentButtons.forEach(button => {
            button.onclick = (e) => {
              const value = button.getAttribute('value');
              quillInstance.format('indent', value);
            };
          });

          // Align
          const alignSelect = document.querySelector('.ql-align');
          if (alignSelect) {
            alignSelect.onchange = (e) => {
              const align = e.target.value;
              quillInstance.format('align', align || false);
            };
          }

          // Direction
          const directionButton = document.querySelector('.ql-direction');
          if (directionButton) {
            directionButton.onclick = (e) => {
              const current = quillInstance.getFormat().direction;
              quillInstance.format('direction', current === 'rtl' ? false : 'rtl');
            };
          }

          // Link
          const linkButton = document.querySelector('.ql-link');
          if (linkButton) {
            linkButton.onclick = (e) => {
              const url = prompt('Enter link URL:');
              if (url) {
                quillInstance.format('link', url);
              }
            };
          }

          // Image
          const imageButton = document.querySelector('.ql-image');
          if (imageButton) {
            imageButton.onclick = (e) => {
              const url = prompt('Enter image URL:');
              if (url) {
                const range = quillInstance.getSelection() || { index: 0 };
                quillInstance.insertEmbed(range.index, 'image', url);
              }
            };
          }

          // Video
          const videoButton = document.querySelector('.ql-video');
          if (videoButton) {
            videoButton.onclick = (e) => {
              const url = prompt('Enter video URL:');
              if (url) {
                const range = quillInstance.getSelection() || { index: 0 };
                quillInstance.insertEmbed(range.index, 'video', url);
              }
            };
          }

          // Blockquote
          const blockquoteButton = document.querySelector('.ql-blockquote');
          if (blockquoteButton) {
            blockquoteButton.onclick = (e) => {
              const isQuote = quillInstance.getFormat().blockquote;
              quillInstance.format('blockquote', !isQuote);
            };
          }

          // Code block
          const codeBlockButton = document.querySelector('.ql-code-block');
          if (codeBlockButton) {
            codeBlockButton.onclick = (e) => {
              const isCode = quillInstance.getFormat()['code-block'];
              quillInstance.format('code-block', !isCode);
            };
          }

          // Clean
          const cleanButton = document.querySelector('.ql-clean');
          if (cleanButton) {
            cleanButton.onclick = (e) => {
              const range = quillInstance.getSelection();
              if (range) {
                quillInstance.removeFormat(range.index, range.length);
              }
            };
          }
        };

        connectDesktopHandlers();

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

  return (
    <>
      {/* Desktop Toolbar - Hidden on Mobile */}
      <div className="toolbar-wrapper desktop-only">
        <div className="toolbar-container">
          <div id="toolbar" className="ql-toolbar ql-snow">
            <span className="ql-formats">
              <button className="ql-undo custom-undo" type="button" title="Undo" data-custom="undo">↶</button>
              <button className="ql-redo custom-redo" type="button" title="Redo" data-custom="redo">↷</button>
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

      {/* Mobile Toolbar - Bottom Fixed Position */}
      <div className="mobile-toolbar-container mobile-only">
        {/* Essential Tools - Hidden when advanced is open */}
        {!showAdvancedTools && (
          <div className="mobile-toolbar-sections">
            {/* Section 1: History & Formatting */}
            <div className="mobile-essential-toolbar section-formatting">
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
              </div>
            </div>

            {/* Section 2: Utilities */}
            <div className="mobile-essential-toolbar section-utilities">
              <div className="mobile-essential">
                <div className="tool-item">
                  <button
                    className="mobile-save-button"
                    onClick={onDownload}
                    disabled={isDownloading}
                    title="Save Document"
                  >
                    {isDownloading ? '⏳' : <Save size={24} />}
                  </button>
                  <span className="tool-label">Save</span>
                </div>
                <div className="tool-item">
                  <button
                    className={`modern-show-button ${showAdvancedTools ? 'active' : ''}`}
                    onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                    title="Show Advanced Tools"
                  >
                    <Diff size={24} />
                  </button>
                  <span className="tool-label">More</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Tools Section - Paginated */}
        {showAdvancedTools && (
          <div className="mobile-advanced-section">
            {/* Navigation Header */}
            <div className="advanced-nav">
              <button
                className="advanced-nav-button"
                onClick={() => setAdvancedPage(0)}
                disabled={advancedPage === 0}
              >
                ‹
              </button>
              <span className="advanced-page-indicator">
                {advancedPage === 0 ? 'Text Styling' : 'Paragraph & Objects'} • {advancedPage + 1}/2
              </span>
              <button
                className="advanced-nav-button"
                onClick={() => setAdvancedPage(1)}
                disabled={advancedPage === 1}
              >
                ›
              </button>
            </div>

            {/* Page 1: Text Styling Tools */}
            {advancedPage === 0 && (
              <div className="advanced-tools-row">
                <div className="tool-item">
                  <select className="tool-select" onChange={handleFontChange} value={activeFormats.font || ''} title="Font">
                    <option value="">Sans</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Mono</option>
                  </select>
                  <span className="tool-label">Font</span>
                </div>
                <div className="tool-item">
                  <select className="tool-select" onChange={handleSizeChange} value={activeFormats.size || ''} title="Size">
                    <option value="small">S</option>
                    <option value="">M</option>
                    <option value="large">L</option>
                    <option value="huge">XL</option>
                  </select>
                  <span className="tool-label">Size</span>
                </div>
                <div className="tool-item">
                  <select className="tool-select" onChange={handleHeaderChange} value={activeFormats.header || ''} title="Header">
                    <option value="">P</option>
                    <option value="1">H1</option>
                    <option value="2">H2</option>
                    <option value="3">H3</option>
                  </select>
                  <span className="tool-label">Header</span>
                </div>
                <hr className="tool-divider" />
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.bold ? 'active' : ''}`} onClick={handleBoldClick}><Bold size={20} /></button>
                  <span className="tool-label">Bold</span>
                </div>
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.italic ? 'active' : ''}`} onClick={handleItalicClick}><Italic size={20} /></button>
                  <span className="tool-label">Italic</span>
                </div>
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.underline ? 'active' : ''}`} onClick={handleUnderlineClick}><Underline size={20} /></button>
                  <span className="tool-label">Underline</span>
                </div>
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.strike ? 'active' : ''}`} onClick={handleStrikeClick}><Strikethrough size={20} /></button>
                  <span className="tool-label">Strike</span>
                </div>
                <hr className="tool-divider" />
                <div className="tool-item">
                  <input type="color" onChange={handleColorChange} value={activeFormats.color || '#000000'} className="color-input" title="Text Color" />
                  <span className="tool-label">Color</span>
                </div>
                <div className="tool-item">
                  <input type="color" onChange={handleBackgroundChange} value={activeFormats.background || '#ffffff'} className="color-input" title="BG Color" />
                  <span className="tool-label">BG</span>
                </div>
              </div>
            )}

            {/* Page 2: Paragraph & Objects Tools */}
            {advancedPage === 1 && (
              <div className="advanced-tools-row">
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.list === 'ordered' ? 'active' : ''}`} onClick={handleListClick('ordered')}><ListOrdered size={20} /></button>
                  <span className="tool-label">Numbered</span>
                </div>
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.list === 'bullet' ? 'active' : ''}`} onClick={handleListClick('bullet')}><List size={20} /></button>
                  <span className="tool-label">Bullet</span>
                </div>
                <div className="tool-item">
                  <button className="tool-button" onClick={handleIndentDecrease}><ArrowLeft size={20} /></button>
                  <span className="tool-label">Indent-</span>
                </div>
                <div className="tool-item">
                  <button className="tool-button" onClick={handleIndentIncrease}><ArrowRight size={20} /></button>
                  <span className="tool-label">Indent+</span>
                </div>
                <hr className="tool-divider" />
                <div className="tool-item">
                  <button className={`tool-button ${!activeFormats.align ? 'active' : ''}`} onClick={handleAlignChange('')}><AlignLeft size={20} /></button>
                  <span className="tool-label">Left</span>
                </div>
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.align === 'center' ? 'active' : ''}`} onClick={handleAlignChange('center')}><AlignCenter size={20} /></button>
                  <span className="tool-label">Center</span>
                </div>
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.align === 'right' ? 'active' : ''}`} onClick={handleAlignChange('right')}><AlignRight size={20} /></button>
                  <span className="tool-label">Right</span>
                </div>
                <hr className="tool-divider" />
                <div className="tool-item">
                  <button className="tool-button" onClick={handleLinkClick}><Link size={20} /></button>
                  <span className="tool-label">Link</span>
                </div>
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats.blockquote ? 'active' : ''}`} onClick={handleQuoteClick}><Quote size={20} /></button>
                  <span className="tool-label">Quote</span>
                </div>
                <div className="tool-item">
                  <button className={`tool-button ${activeFormats['code-block'] ? 'active' : ''}`} onClick={handleCodeBlockClick}><Code size={20} /></button>
                  <span className="tool-label">Code</span>
                </div>
                <div className="tool-item">
                  <button className="tool-button" onClick={handleCleanClick}><Eraser size={20} /></button>
                  <span className="tool-label">Clean</span>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              className="advanced-nav-button"
              style={{ margin: '10px auto 0', display: 'block' }}
              onClick={() => { setShowAdvancedTools(false); setAdvancedPage(0); }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomToolbar;
