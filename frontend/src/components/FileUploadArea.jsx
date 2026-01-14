import { useState } from 'react';
import { Box, Typography } from '@mui/material';
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
      className="glass-card"
      sx={{
        border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--glass-border)'}`,
        padding: { xs: '32px', sm: '48px' },
        textAlign: 'center',
        width: '100%',
        maxWidth: '600px',
        backgroundColor: dragOver ? 'rgba(58, 134, 255, 0.05)' : 'var(--glass-bg)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          borderColor: 'var(--primary)',
          backgroundColor: 'rgba(58, 134, 255, 0.08)',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)'
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
            <Box sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: 'rgba(58, 134, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1
            }}>
              <DescriptionIcon sx={{ fontSize: 32, color: 'var(--primary)' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: 'var(--text-main)',
                fontWeight: 600,
                fontFamily: 'Outfit, sans-serif',
                wordBreak: 'break-word'
              }}
            >
              {file.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem'
              }}
            >
              File selected • Click to change
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CloudUploadIcon sx={{ fontSize: 72, color: 'var(--primary)', opacity: 0.9, mb: 1 }} />
            <Typography
              variant="h6"
              sx={{
                color: 'var(--text-main)',
                fontWeight: 600,
                fontFamily: 'Outfit, sans-serif',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Drop your file here
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'var(--text-muted)',
                fontSize: { xs: '0.95rem', sm: '1.1rem' }
              }}
            >
              or click to browse
            </Typography>
            <Box sx={{
              mt: 2,
              px: 2,
              py: 0.5,
              borderRadius: '20px',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(255,255,255,0.02)'
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.5px'
                }}
              >
                PDF • DOCX
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FileUploadArea;
