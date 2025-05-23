import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Header from "../components/Header";
import FileUploadArea from "./FileUploadArea";
import ConversionControls from "./ConversionControls";
import DownloadLinks from "./DownloadLinks";
import Footer from "./Footer";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [conversionType, setConversionType] = useState('pdf_to_word');
  const [downloadLinks, setDownloadLinks] = useState({ original: '', converted: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleConversionTypeChange = (event) => {
    setConversionType(event.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', conversionType);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result); 
        setDownloadLinks({
          original: `http://localhost:5000/download/${result.original_id}`,
          converted: `http://localhost:5000/download/${result.converted_id}`,
        });
      } else {
        console.error('Upload failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    navigate('/edit-text');
  };

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
          alignItems: 'center', 
          padding: { xs: '20px 16px', sm: '40px 24px' },
          marginTop: { xs: '80px', sm: '100px' }
        }}
      >
        <Button
          variant="outlined"
          onClick={handleNavigate}
          startIcon={<EditIcon />}
          sx={{
            color: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            padding: '12px 24px',
            textTransform: 'none',
            fontWeight: 500,
            marginBottom: 4,
            backdropFilter: 'blur(10px)',
            fontSize: '0.95rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }
          }}
        >
          Go to Text Editor
        </Button>

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 4,
            width: '100%',
            maxWidth: '800px'
          }}
        >
          <FileUploadArea 
            file={file} 
            onFileChange={handleFileChange} 
          />

          <ConversionControls
            conversionType={conversionType}
            onConversionTypeChange={handleConversionTypeChange}
            onUpload={handleUpload}
            loading={loading}
            disabled={!file}
          />

          <DownloadLinks downloadLinks={downloadLinks} />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default UploadForm;