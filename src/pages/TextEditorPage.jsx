import { useState, useRef } from 'react';
import Header from '../components/Header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Button, TextField, Grid, IconButton, Select, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { GitHub, Email, LinkedIn, Instagram } from '@mui/icons-material';
import Quill from 'quill';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun } from 'docx';

// Define custom Blots for page breaks and footers
const PageBreakBlot = Quill.import('blots/block');
class PageBreak extends PageBreakBlot {
  static create() {
    let node = super.create();
    node.setAttribute('class', 'page-break');
    return node;
  }
}
PageBreak.blotName = 'page-break';
PageBreak.tagName = 'div';
Quill.register(PageBreak);

const FooterBlot = Quill.import('blots/block');
class Footer extends FooterBlot {
  static create() {
    let node = super.create();
    node.setAttribute('class', 'footer');
    return node;
  }
}
Footer.blotName = 'footer';
Footer.tagName = 'div';
Quill.register(Footer);

// Define modules and formats for Quill editor
const modules = {
  toolbar: {
    container: [
      [{ 'header': '1' }, { 'header': '2' }, { 'header': '3' }, { 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'direction': 'rtl' }],
      ['blockquote', 'code-block'],
      ['clean'], // Remove formatting button
      ['page-break'], // Custom page break button
      ['footer'], // Custom footer button
    ],
    handlers: {
      'page-break': function () {
        const range = this.quill.getSelection();
        if (range) {
          this.quill.insertEmbed(range.index, 'page-break', true);
          this.quill.setSelection(range.index + 1);
        }
      },
      'footer': function () {
        const range = this.quill.getSelection();
        if (range) {
          this.quill.insertEmbed(range.index, 'footer', true);
          this.quill.setSelection(range.index + 1);
        }
      }
    }
  }
};

const formats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'align', 'link', 'image', 'video', 'script',
  'direction', 'blockquote', 'code-block', 'clean', 'page-break', 'footer', 
];

const TextEditorPage = () => {
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('document');
  const [fileType, setFileType] = useState('docx');
  const quillRef = useRef(null); // Create a ref for ReactQuill

  const handleSave = async () => {
    if (quillRef.current) {
      const content = quillRef.current.getEditor().root.innerHTML;

      if (fileType === 'docx') {
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                children: [new TextRun(content.replace(/<[^>]+>/g, ''))]
              })
            ]
          }]
        });

        Packer.toBlob(doc).then(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename}.docx`;
          a.click();
          URL.revokeObjectURL(url);
        });
      } else if (fileType === 'pdf') {
        const opt = {
          margin: 1,
          filename: `${filename}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(content).set(opt).save();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ marginTop: '80px', padding: '20px', flex: 1 }}>
        <div style={{
          position: 'fixed',
          top: 60,
          left: 0,
          right: 0,
          backgroundColor: '#f5f5f5',
          padding: '10px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          zIndex: 10,
          marginBottom: '20px'
        }}>
          {/* The toolbar for the Quill editor will be rendered here */}
        </div>

        <div style={{ marginTop: '80px', paddingTop: '50px' }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8}>
              <ReactQuill
                theme="snow"
                value={text}
                onChange={(value) => setText(value)}
                modules={modules}
                formats={formats}
                style={{ minHeight: '400px', backgroundColor: '#fff' }}
                ref={quillRef} // Attach the ref here
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Filename"
                variant="outlined"
                fullWidth
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                style={{ marginBottom: '10px' }}
              />
              <Select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                fullWidth
                style={{ marginBottom: '10px' }}
              >
                <MenuItem value="docx">Word Document (.docx)</MenuItem>
                <MenuItem value="pdf">PDF (.pdf)</MenuItem>
              </Select>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                fullWidth
              >
                Save File
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
      <footer style={{
        backgroundColor: '#f5f5f5',
        padding: '10px',
        textAlign: 'center',
        borderTop: '1px solid #ddd',
        fontFamily: 'gil-sans, arial',
      }}>
        <p>© 2024 manuel. All rights reserved.</p>
        <div style={{ margin: '10px 0' }}>
          <IconButton component="a" href="https://github.com/mgiftson0" target="_blank" rel="noopener noreferrer">
            <GitHub />
          </IconButton>
          <IconButton component="a" href="mailto:mgfiton00@gmail.com" target="_blank" rel="noopener noreferrer">
            <Email />
          </IconButton>
          <IconButton component="a" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedIn />
          </IconButton>
          <IconButton component="a" href="https://www.instagram.com/msabali_" target="_blank" rel="noopener noreferrer">
            <Instagram />
          </IconButton>
        </div>
        <div>
          <a href="https://sabali-mu.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>
            manuel ♂
          </a>
        </div>
      </footer>
    </div>
  );
};

export default TextEditorPage;
