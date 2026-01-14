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
        maxWidth: '700px',
        mt: 6
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: 'var(--text-main)',
          textAlign: 'center',
          mb: 4,
          fontWeight: 700,
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        Your files are ready!
      </Typography>

      <Grid container spacing={3} justifyContent="center">
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
                color: 'var(--text-main)',
                borderColor: 'var(--glass-border)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                padding: '14px 24px',
                textTransform: 'none',
                fontWeight: 600,
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
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
                background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)',
                color: 'white',
                borderRadius: '16px',
                padding: '14px 24px',
                textTransform: 'none',
                fontWeight: 600,
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1rem',
                boxShadow: '0 8px 20px rgba(131, 56, 236, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 25px rgba(131, 56, 236, 0.35)',
                  filter: 'brightness(1.1)'
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