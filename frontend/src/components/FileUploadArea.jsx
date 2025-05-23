import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';

const FileUploadArea = ({ file, onFileChange }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onFileChange({ target: { files: [droppedFile] } });
    }
  };

  return (
    <Box
      sx={{
        border: `2px dashed ${dragOver ? '#90caf9' : '#64b5f6'}`,
        borderRadius: '16px',
        padding: { xs: '24px', sm: '32px' },
        textAlign: 'center',
        width: '100%',
        maxWidth: '600px',
        backgroundColor: dragOver ? 'rgba(100, 181, 246, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          borderColor: '#90caf9',
          backgroundColor: 'rgba(100, 181, 246, 0.08)',
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))',
          borderRadius: '16px'
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={onFileChange}
        accept=".pdf,.docx"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          zIndex: 2
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {file ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <DescriptionIcon sx={{ fontSize: 48, color: '#64b5f6' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ffffff', 
                fontWeight: 500,
                wordBreak: 'break-word' 
              }}
            >
              {file.name}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem'
              }}
            >
              File selected • Click to change
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 64, color: '#64b5f6', opacity: 0.8 }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#ffffff', 
                fontWeight: 500,
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Drop your file here
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              or click to browse
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.8rem',
                mt: 1
              }}
            >
              Supports PDF and DOCX files
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FileUploadArea;