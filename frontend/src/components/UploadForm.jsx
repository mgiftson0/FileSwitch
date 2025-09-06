import { useState } from 'react';
import { Box, Container } from '@mui/material';
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
  
  // API base URL - updated to your Render backend
  const API_BASE_URL = 'https://fileswitch-8zjy.onrender.com';

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
      // Updated API URL
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result); 
        setDownloadLinks({
          // Updated download URLs
          original: `${API_BASE_URL}/download/${result.original_id}`,
          converted: `${API_BASE_URL}/download/${result.converted_id}`,
        });
      } else {
        console.error('Upload failed:', response.statusText);
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
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