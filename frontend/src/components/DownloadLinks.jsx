import { Grid, Button, Box, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';

const DownloadLinks = ({ downloadLinks }) => {
  if (!downloadLinks.original && !downloadLinks.converted) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '600px',
        mt: 4
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#ffffff', 
          textAlign: 'center', 
          mb: 3,
          fontWeight: 500
        }}
      >
        Your files are ready!
      </Typography>
      
      <Grid container spacing={2} justifyContent="center">
        {downloadLinks.original && (
          <Grid item xs={12} sm={6}>
            <Button
              component="a"
              href={downloadLinks.original}
              download
              variant="outlined"
              fullWidth
              startIcon={<DescriptionIcon />}
              endIcon={<DownloadIcon />}
              sx={{
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '12px',
                padding: '12px 16px',
                textTransform: 'none',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              Original File
            </Button>
          </Grid>
        )}
        
        {downloadLinks.converted && (
          <Grid item xs={12} sm={6}>
            <Button
              component="a"
              href={downloadLinks.converted}
              download
              variant="contained"
              fullWidth
              startIcon={<DescriptionIcon />}
              endIcon={<DownloadIcon />}
              sx={{
                backgroundColor: '#64b5f6',
                color: '#0a1625',
                borderRadius: '12px',
                padding: '12px 16px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(100, 181, 246, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: '#90caf9',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(100, 181, 246, 0.4)'
                }
              }}
            >
              Converted File
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DownloadLinks;