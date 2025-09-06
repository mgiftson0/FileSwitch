import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import { useRef, useEffect, useCallback, useMemo } from 'react';

// Suppress findDOMNode warning from ReactQuill
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('findDOMNode is deprecated')
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Define custom Blots for page breaks (only register once)
let PageBreakRegistered = false;

const registerPageBreak = () => {
  if (PageBreakRegistered) return;
  
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
  
  try {
    Quill.register(PageBreak, true);
    PageBreakRegistered = true;
  } catch (error) {
    PageBreakRegistered = true;
  }
};

// Register the custom blot
registerPageBreak();

const EditorContainer = ({ text, setText, pageWidth, setQuillInstance }) => {
  const quillRef = useRef(null);

  // Memoize modules - don't include undo/redo as toolbar handlers since they're not valid formats
  const modules = useMemo(() => ({
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
          
          this.quill.updateContents([
            ...currentContent.ops,
            pageBreak,
            newPageContent
          ]);
          
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
  }), []);

  // Memoize formats array - exclude undo/redo since they cause warnings
  const formats = useMemo(() => [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'script', 'align', 'direction', 'indent',
    'list', 'bullet', 'link', 'image', 'video', 'blockquote', 'code-block',
    'clean', 'page-break'
  ], []);

  // Use callback ref
  const handleQuillRef = useCallback((reactQuillComponent) => {
    if (reactQuillComponent) {
      quillRef.current = reactQuillComponent;
      const editor = reactQuillComponent.getEditor();
      setQuillInstance(editor);
    }
  }, [setQuillInstance]);

  // Add handlers for undo/redo buttons
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      
      const addButtonHandler = (selector, action) => {
        const button = document.querySelector(selector);
        if (button && !button.dataset.listenerAdded) {
          button.dataset.listenerAdded = 'true';
          button.addEventListener('click', (e) => {
            e.preventDefault();
            action(editor);
          });
        }
      };

      const timer = setTimeout(() => {
        addButtonHandler('.ql-undo', (editor) => {
          editor.history.undo();
        });
        
        addButtonHandler('.ql-redo', (editor) => {
          editor.history.redo();
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="editor-wrapper">
      <div 
        className="editor-container"
        style={{
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease'
        }}
      >
        <ReactQuill
          ref={handleQuillRef}
          theme="snow"
          value={text}
          onChange={setText}
          modules={modules}
          formats={formats}
          placeholder="Start writing your document..."
          style={{
            background: 'transparent'
          }}
        />
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
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
            border-radius: 4px;
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
          
          .editor-container .page-break {
            page-break-after: always;
            border-top: 2px dashed #ccc;
            margin: 20px 0;
            text-align: center;
            color: #666;
            font-size: 12px;
            padding: 10px 0;
          }
        `
      }} />
    </div>
  );
};

export default EditorContainer;