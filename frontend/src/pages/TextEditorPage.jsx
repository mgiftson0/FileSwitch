import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';

// Define custom Blots for page breaks
const PageBreakBlot = Quill.import('blots/block');
class PageBreak extends PageBreakBlot {
  static create() {
    let node = super.create();
    node.setAttribute('class', 'page-break');
    node.innerHTML = '<div style="page-break-after: always; border-top: 2px dashed #ccc; margin: 20px 0; text-align: center; color: #666; font-size: 12px; padding: 10px 0;">--- Page Break ---</div>';
    return node;
  }
}
PageBreak.blotName = 'page-break';
PageBreak.tagName = 'div';
Quill.register(PageBreak);

// Extended modules with more tools
const modules = {
  toolbar: {
    container: '#toolbar',
    handlers: {
      'page-break': function () {
        const range = this.quill.getSelection();
        if (range) {
          this.quill.insertEmbed(range.index, 'page-break', true);
          this.quill.setSelection(range.index + 1);
        }
      },
      'new-page': function() {
        const currentContent = this.quill.getContents();
        const pageBreak = { insert: '\n', attributes: { 'page-break': true } };
        const newPageContent = { insert: '\n\n\n' };
        
        // Insert page break and new content
        this.quill.updateContents([
          ...currentContent.ops,
          pageBreak,
          newPageContent
        ]);
        
        // Move cursor to the new page
        const length = this.quill.getLength();
        this.quill.setSelection(length - 1);
        this.quill.focus();
      }
    }
  },
  history: {
    delay: 1000,
    maxStack: 500,
    userOnly: true
  }
};

const formats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'script', 'align', 'direction', 'indent',
  'list', 'bullet', 'link', 'image', 'video', 'blockquote', 'code-block',
  'clean', 'page-break'
];

const TextEditorPage = () => {
  const [text, setText] = useState('');
  const [quillInstance, setQuillInstance] = useState(null);
  const [pageWidth, setPageWidth] = useState(816); // A4 width in pixels at 96 DPI

  const pageWidthOptions = [
    { value: 612, label: 'Letter (8.5")' },
    { value: 816, label: 'A4 (8.27")' },
    { value: 1056, label: 'Legal (11")' },
    { value: 720, label: 'Custom (7.5")' },
    { value: 960, label: 'Wide (10")' }
  ];

  useEffect(() => {
    if (quillInstance) {
      // Add custom button handlers
      const toolbar = quillInstance.getModule('toolbar');
      
      // Undo button
      const undoButton = document.querySelector('.ql-undo');
      if (undoButton) {
        undoButton.addEventListener('click', () => {
          quillInstance.history.undo();
        });
      }
      
      // Redo button
      const redoButton = document.querySelector('.ql-redo');
      if (redoButton) {
        redoButton.addEventListener('click', () => {
          quillInstance.history.redo();
        });
      }
    }
  }, [quillInstance]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '1rem'
    }}>
      <style>
        {`
          .toolbar-container .ql-toolbar {
            border: 1px solid #e5e7eb !important;
            border-radius: 6px !important;
            padding: 4px 8px !important;
            background-color: #ffffff !important;
            font-family: 'Inter', system-ui, sans-serif;
            display: flex;
            flex-wrap: wrap;
            gap: 0.125rem;
            align-items: center;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
          }
          .toolbar-container .ql-formats {
            display: flex !important;
            align-items: center !important;
            gap: 0.125rem !important;
            margin: 0 !important;
            padding: 0 4px;
            border-right: 1px solid #e5e7eb;
          }
          .toolbar-container .ql-formats:last-child {
            border-right: none !important;
            padding-right: 0;
          }
          .toolbar-container button {
            width: 20px !important;
            height: 20px !important;
            border: none !important;
            border-radius: 3px !important;
            background-color: transparent !important;
            color: #4b5563 !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.12s ease !important;
            font-size: 10px !important;
            position: relative !important;
            cursor: pointer !important;
          }
          .toolbar-container button:hover {
            background-color: #f3f4f6 !important;
            color: #1f2937 !important;
          }
          .toolbar-container button.ql-active {
            background-color: #3b82f6 !important;
            color: #ffffff !important;
          }
          .toolbar-container button::after {
            content: attr(title);
            position: absolute;
            bottom: -24px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 9px;
            color: #6b7280;
            background: #374151;
            padding: 2px 6px;
            border-radius: 3px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 1000;
          }
          .toolbar-container button:hover::after {
            opacity: 1;
          }
          .toolbar-container .ql-picker .ql-picker-label {
            border: none !important;
            border-radius: 3px !important;
            background-color: transparent !important;
            color: #4b5563 !important;
            padding: 2px 6px !important;
            height: 20px !important;
            line-height: 16px !important;
            font-size: 10px !important;
            transition: all 0.12s ease !important;
            min-width: 40px !important;
            cursor: pointer !important;
          }
          .toolbar-container .ql-picker .ql-picker-label:hover {
            background-color: #f3f4f6 !important;
            color: #1f2937 !important;
          }
          .toolbar-container .ql-picker .ql-picker-options {
            background-color: #ffffff !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 4px !important;
            padding: 2px !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12) !important;
            max-height: 160px !important;
            overflow-y: auto !important;
            z-index: 2000 !important;
          }
          .toolbar-container .ql-picker .ql-picker-item {
            color: #374151 !important;
            padding: 2px 6px !important;
            border-radius: 2px !important;
            transition: all 0.12s ease !important;
            font-size: 10px !important;
          }
          .toolbar-container .ql-picker .ql-picker-item:hover {
            background-color: #f3f4f6 !important;
          }
          .toolbar-container .ql-picker .ql-picker-item.ql-selected {
            background-color: #3b82f6 !important;
            color: #ffffff !important;
          }
          .toolbar-container .ql-stroke {
            stroke: currentColor !important;
            stroke-width: 1.2px !important;
          }
          .toolbar-container .ql-fill {
            fill: currentColor !important;
          }
          .toolbar-container svg {
            width: 12px !important;
            height: 12px !important;
          }
          .editor-container .ql-container {
            border: none !important;
            font-size: 14px;
            font-family: 'Inter', system-ui, sans-serif;
          }
          .editor-container .ql-editor {
            min-height: 70vh;
            padding: 40px;
            line-height: 1.6;
            color: #1f2937;
            font-size: 14px;
            max-width: ${pageWidth}px;
            margin: 0 auto;
            box-shadow: 0 0 0 1px #e5e7eb;
            background: #ffffff;
          }
          .editor-container .ql-editor.ql-blank::before {
            color: #9ca3af;
            font-style: italic;
            font-size: 14px;
          }
          .editor-container .ql-editor h1 {
            font-size: 1.875rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #111827;
          }
          .editor-container .ql-editor h2 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            color: #1f2937;
          }
          .editor-container .ql-editor h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #374151;
          }
          .editor-container .ql-editor p {
            margin-bottom: 0.75rem;
          }
          .editor-container .ql-editor blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: #6b7280;
          }
          .editor-container .ql-editor ul,
          .editor-container .ql-editor ol {
            padding-left: 1.5rem;
            margin-bottom: 0.75rem;
          }
          .editor-container .ql-editor li {
            margin-bottom: 0.25rem;
          }
          .editor-container .ql-toolbar {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
            border-top: 2px dashed #ccc;
            margin: 20px 0;
            text-align: center;
            color: #666;
            font-size: 12px;
            padding: 10px 0;
          }
          .control-panel {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
            padding: 0.5rem 0.75rem;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .control-panel label {
            font-size: 12px;
            font-weight: 500;
            color: #374151;
          }
          .control-panel select {
            font-size: 12px;
            padding: 4px 8px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            background: #ffffff;
          }
        `}
      </style>
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        margin: '0 auto',
        width: '100%',
        maxWidth: '1400px'
      }}>
        {/* Control Panel */}
        <div className="control-panel">
          <label>Page Width:</label>
          <select 
            value={pageWidth} 
            onChange={(e) => setPageWidth(parseInt(e.target.value))}
          >
            {pageWidthOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expanded Toolbar */}
        <div style={{
          position: 'sticky',
          top: '0.5rem',
          zIndex: 1000,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '0.5rem',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease'
        }}>
          <div className="toolbar-container">
            <div id="toolbar" className="ql-toolbar ql-snow">
              <span className="ql-formats">
                <button className="ql-undo" type="button" title="Undo">↶</button>
                <button className="ql-redo" type="button" title="Redo">↷</button>
                <button className="ql-new-page" type="button" title="Add Page">📄</button>
                <button className="ql-page-break" type="button" title="Page Break">📑</button>
              </span>
              <span className="ql-formats">
                <select className="ql-font" title="Font Family">
                  <option value="">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
                <select className="ql-size" title="Font Size">
                  <option value="small">Small</option>
                  <option value="" selected>Normal</option>
                  <option value="large">Large</option>
                  <option value="huge">Huge</option>
                </select>
              </span>
              <span className="ql-formats">
                <select className="ql-header" title="Heading Level">
                  <option value="" selected>Normal</option>
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
                <select className="ql-align" title="Text Alignment">
                  <option value="" selected>Left</option>
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

        {/* Editor Container */}
        <div style={{
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease'
        }}>
          <div className="editor-container">
            <ReactQuill
              theme="snow"
              value={text}
              onChange={(value) => setText(value)}
              modules={modules}
              formats={formats}
              placeholder="Start writing your document..."
              ref={(el) => {
                if (el && !quillInstance) {
                  setQuillInstance(el.getEditor());
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditorPage;