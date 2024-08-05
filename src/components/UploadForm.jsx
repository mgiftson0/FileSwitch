import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button, Grid, MenuItem, Select, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
        console.log('Upload successful:', result); // Log the response
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigate}
          style={{ marginTop: '70px' }}
        >
          Go to Text Editor
        </Button>
        <div
          style={{
            border: '2px dashed blue',
            padding: '50px',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '20px',
            width: '100%',
            maxWidth: '500px',
            marginTop: '100px',
          }}
        >
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx"
            style={{ marginBottom: '10px' }}
          />
          <p>{file ? file.name : 'Drag & drop a file here, or click to select one'}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <Select
            value={conversionType}
            onChange={handleConversionTypeChange}
            style={{ marginRight: '10px', marginBottom: '10px' }}
          >
            <MenuItem value="pdf_to_word">PDF to Word</MenuItem>
            <MenuItem value="word_to_pdf">Word to PDF</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpload}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <CloudUploadIcon />}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload and Convert'}
          </Button>
        </div>

        <Grid container spacing={2} justifyContent="center">
          {downloadLinks.original && (
            <Grid item xs={12} sm={6} md={4}>
              <a href={downloadLinks.original} download>
                <Button variant="contained" color="primary" fullWidth>
                  Download Original File
                </Button>
              </a>
            </Grid>
          )}
          {downloadLinks.converted && (
            <Grid item xs={12} sm={6} md={4}>
              <a href={downloadLinks.converted} download>
                <Button variant="contained" color="primary" fullWidth>
                  Download Converted File
                </Button>
              </a>
            </Grid>
          )}
        </Grid>
      </div>

      <Footer />
    </div>
  );
};

export default UploadForm;
