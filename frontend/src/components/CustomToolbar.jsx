import { useEffect } from 'react';

const CustomToolbar = ({ quillInstance }) => {
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
      };
    }
  }, [quillInstance]);

  return (
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
  );
};

export default CustomToolbar;