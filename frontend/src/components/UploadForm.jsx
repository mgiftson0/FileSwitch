import { useState } from 'react';
import { Box, Container } from '@mui/material';
import FileUploadArea from "./FileUploadArea";
import ConversionControls from "./ConversionControls";
import DownloadLinks from "./DownloadLinks";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [conversionType, setConversionType] = useState('pdf_to_word');
  const [downloadLinks, setDownloadLinks] = useState({ original: '', converted: '' });
  const [loading, setLoading] = useState(false);

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
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDownloadLinks({
          original: `${API_BASE_URL}/download/${result.original_id}`,
          converted: `${API_BASE_URL}/download/${result.converted_id}`,
        });
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        py: 4
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          mb: 4
        }}
      >
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #fff 0%, #adb5bd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Transform Your Files
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Secure, fast, and high-quality file conversion at your fingertips.
        </p>
      </Box>

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
  );
};

export default UploadForm;
