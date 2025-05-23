import { Box, Select, MenuItem, Button, CircularProgress, FormControl, InputLabel } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const ConversionControls = ({ 
  conversionType, 
  onConversionTypeChange, 
  onUpload, 
  loading, 
  disabled 
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center', 
        gap: 3,
        padding: { xs: '20px', sm: '24px' },
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '500px'
      }}
    >
      <FormControl sx={{ minWidth: { xs: '100%', sm: 180 } }}>
        <InputLabel 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': { color: '#64b5f6' }
          }}
        >
          Conversion Type
        </InputLabel>
        <Select
          value={conversionType}
          onChange={onConversionTypeChange}
          label="Conversion Type"
          sx={{
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.3)'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#64b5f6'
            },
            '& .MuiSelect-icon': {
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: '#1a2332',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                '& .MuiMenuItem-root': {
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: 'rgba(100, 181, 246, 0.1)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(100, 181, 246, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(100, 181, 246, 0.3)'
                    }
                  }
                }
              }
            }
          }}
        >
          <MenuItem value="pdf_to_word">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              PDF <SwapHorizIcon sx={{ fontSize: 16 }} /> Word
            </Box>
          </MenuItem>
          <MenuItem value="word_to_pdf">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Word <SwapHorizIcon sx={{ fontSize: 16 }} /> PDF
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        onClick={onUpload}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        sx={{
          backgroundColor: '#64b5f6',
          color: '#0a1625',
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: '12px',
          textTransform: 'none',
          fontFamily: '"Poppins", "Roboto", sans-serif',
          fontSize: '0.95rem',
          minWidth: { xs: '100%', sm: 'auto' },
          boxShadow: '0 4px 16px rgba(100, 181, 246, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#90caf9',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(100, 181, 246, 0.4)'
          },
          '&:disabled': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.5)'
          }
        }}
      >
        {loading ? 'Converting...' : 'Upload & Convert'}
      </Button>
    </Box>
  );
};

export default ConversionControls;