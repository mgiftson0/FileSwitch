import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import { useRef, useEffect, useCallback, useMemo } from 'react';

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
    Quill.register(PageBreak, true); // true to suppress overwrite warnings
    PageBreakRegistered = true;
  } catch (error) {
    // Already registered, ignore
    PageBreakRegistered = true;
  }
};

// Register the custom blot
registerPageBreak();

const EditorContainer = ({ text, setText, pageWidth, setQuillInstance }) => {
  const quillRef = useRef(null);

  // Memoize modules to prevent recreation on every render
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
  }), []);

  // Memoize formats array
  const formats = useMemo(() => [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'script', 'align', 'direction', 'indent',
    'list', 'bullet', 'link', 'image', 'video', 'blockquote', 'code-block',
    'clean', 'page-break'
  ], []);

  // Use ref callback to get the quill instance
  const quillRefCallback = useCallback((ref) => {
    if (ref) {
      quillRef.current = ref;
      const editor = ref.getEditor();
      setQuillInstance(editor);
    }
  }, [setQuillInstance]);

  // Add custom toolbar handlers after component mounts
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      
      // Add undo/redo button handlers
      const addButtonHandler = (selector, action) => {
        const button = document.querySelector(selector);
        if (button) {
          // Remove existing listeners to prevent duplicates
          button.replaceWith(button.cloneNode(true));
          const newButton = document.querySelector(selector);
          if (newButton) {
            newButton.addEventListener('click', (e) => {
              e.preventDefault();
              action(editor);
            });
          }
        }
      };

      // Add handlers with a small delay to ensure toolbar is rendered
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
          ref={quillRefCallback}
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
      
      <style jsx>{`
        .editor-container :global(.ql-container) {
          border: none !important;
          font-size: 14px;
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .editor-container :global(.ql-editor) {
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
        
        .editor-container :global(.ql-editor.ql-blank::before) {
          color: #9ca3af;
          font-style: italic;
          font-size: 14px;
        }
        
        .editor-container :global(.ql-editor h1) {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .editor-container :global(.ql-editor h2) {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }
        
        .editor-container :global(.ql-editor h3) {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        .editor-container :global(.ql-editor p) {
          margin-bottom: 0.75rem;
        }
        
        .editor-container :global(.ql-editor blockquote) {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .editor-container :global(.ql-editor ul),
        .editor-container :global(.ql-editor ol) {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .editor-container :global(.ql-editor li) {
          margin-bottom: 0.25rem;
        }
        
        .editor-container :global(.ql-toolbar) {
          display: none !important;
        }
        
        .editor-container :global(.page-break) {
          page-break-after: always;
          border-top: 2px dashed #ccc;
          margin: 20px 0;
          text-align: center;
          color: #666;
          font-size: 12px;
          padding: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default EditorContainer;