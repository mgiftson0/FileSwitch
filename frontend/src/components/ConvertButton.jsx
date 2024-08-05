import React from 'react';
import { Button } from '@mui/material';

const ConvertButton = ({ files }) => {
  const handleConvert = () => {
    if (files.length === 0) {
      alert('Please upload a file first.');
      return;
    }
    // Add logic to handle file conversion
    console.log('Files to convert:', files);
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleConvert} sx={{ mt: 2 }}>
      Convert Files
    </Button>
  );
};

export default ConvertButton;
