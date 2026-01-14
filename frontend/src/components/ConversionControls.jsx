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
      className="glass-card"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 3,
        padding: '24px',
        width: '100%',
        maxWidth: '600px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <FormControl sx={{ minWidth: { xs: '100%', sm: 220 } }}>
        <InputLabel
          sx={{
            color: 'var(--text-muted)',
            '&.Mui-focused': { color: 'var(--primary)' }
          }}
        >
          Conversion Type
        </InputLabel>
        <Select
          value={conversionType}
          onChange={onConversionTypeChange}
          label="Conversion Type"
          sx={{
            color: 'var(--text-main)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--glass-border)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.2)'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--primary)'
            },
            '& .MuiSelect-icon': {
              color: 'var(--text-muted)'
            }
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'var(--bg-dark)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                marginTop: '8px',
                '& .MuiMenuItem-root': {
                  color: 'var(--text-main)',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(58, 134, 255, 0.1)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(58, 134, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(58, 134, 255, 0.3)'
                    }
                  }
                }
              }
            }
          }}
        >
          <MenuItem value="pdf_to_word">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <span style={{ fontWeight: 500 }}>PDF</span>
              <SwapHorizIcon sx={{ fontSize: 18, color: 'var(--primary)' }} />
              <span style={{ fontWeight: 500 }}>Word</span>
            </Box>
          </MenuItem>
          <MenuItem value="word_to_pdf">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <span style={{ fontWeight: 500 }}>Word</span>
              <SwapHorizIcon sx={{ fontSize: 18, color: 'var(--primary)' }} />
              <span style={{ fontWeight: 500 }}>PDF</span>
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
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          color: 'white',
          fontWeight: 600,
          padding: '14px 32px',
          borderRadius: '12px',
          textTransform: 'none',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '1rem',
          flex: 1,
          minWidth: { xs: '100%', sm: 'auto' },
          boxShadow: '0 8px 20px rgba(58, 134, 255, 0.25)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 25px rgba(58, 134, 255, 0.35)',
            filter: 'brightness(1.1)'
          },
          '&:disabled': {
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-muted)'
          }
        }}
      >
        {loading ? 'Converting...' : 'Upload & Convert'}
      </Button>
    </Box>
  );
};

export default ConversionControls;
