import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { Button, TextField, Grid, IconButton, Box, Container } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { GitHub, Email, LinkedIn, Instagram } from '@mui/icons-material';
import Quill from 'quill';

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
      ['clean'], 
      ['page-break'], 
      ['footer'], 
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
  const [filename, setFilename] = useState('document.txt');

  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.');
        }
      });
    });

    const config = { childList: true, subtree: true };
    const targetNode = document.getElementById('your-target-element');
    if (targetNode) {
      observer.observe(targetNode, config);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: '#0a1625',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(100, 181, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(187, 222, 251, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(144, 202, 249, 0.04) 0%, transparent 50%)
        `
      }}
    >
      <Header />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          padding: { xs: '20px 16px', sm: '40px 24px' },
          marginTop: { xs: '80px', sm: '100px' }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 4,
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >
          {/* Editor Container */}
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
              },
              '& .ql-toolbar': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px 16px',
                '& .ql-picker-label': {
                  color: '#ffffff !important'
                },
                '& .ql-stroke': {
                  stroke: '#ffffff !important'
                },
                '& .ql-fill': {
                  fill: '#ffffff !important'
                },
                '& button': {
                  borderRadius: '6px',
                  padding: '4px',
                  margin: '0 2px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              },
              '& .ql-container': {
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                minHeight: '500px',
                '& .ql-editor': {
                  fontSize: '16px',
                  lineHeight: '1.6',
                  padding: '24px',
                  color: '#1a1a1a',
                  '&.ql-blank::before': {
                    color: '#999',
                    fontStyle: 'italic'
                  }
                }
              }
            }}
          >
            <ReactQuill
              theme="snow"
              value={text}
              onChange={(value) => setText(value)}
              modules={modules}
              formats={formats}
              placeholder="Start writing your document..."
            />
          </Box>

          {/* Controls Container */}
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
              }
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Filename"
                  variant="outlined"
                  fullWidth
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.4)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#64b5f6',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(0, 0, 0, 0.7)',
                      '&.Mui-focused': {
                        color: '#64b5f6'
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#1a1a1a',
                      fontSize: '16px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '16px',
                    boxShadow: '0 4px 16px rgba(100, 181, 246, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(100, 181, 246, 0.4)'
                    }
                  }}
                >
                  Save Document
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px 16px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          marginTop: 'auto'
        }}
      >
        <Box sx={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: 2 }}>
          © 2024 manuel. All rights reserved.
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginBottom: 2 }}>
          <IconButton 
            component="a" 
            href="https://github.com/mgiftson0" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <GitHub />
          </IconButton>
          
          <IconButton 
            component="a" 
            href="mailto:mgfiton00@gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Email />
          </IconButton>
          
          <IconButton 
            component="a" 
            href="https://www.linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <LinkedIn />
          </IconButton>
          
          <IconButton 
            component="a" 
            href="https://www.instagram.com/msabali_" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Instagram />
          </IconButton>
        </Box>
        
        <Box>
          <Box
            component="a"
            href="https://www.example.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#64b5f6',
                textDecoration: 'underline'
              }
            }}
          >
            manuel ♂
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TextEditorPage;