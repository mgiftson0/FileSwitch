import { Box, Typography, IconButton } from '@mui/material';
import { GitHub, Email, LinkedIn, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a1625',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: { xs: '24px 16px', sm: '32px 24px' },
        textAlign: 'center',
        fontFamily: '"Poppins", "Roboto", sans-serif',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: 2,
          fontWeight: 400
        }}
      >
        © 2025 manuel. All rights reserved.
      </Typography>
      
      <Box sx={{ margin: '16px 0', display: 'flex', justifyContent: 'center', gap: 1 }}>
        <IconButton 
          component="a" 
          href="https://github.com/mgiftson0" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <GitHub />
        </IconButton>
        
        <IconButton 
          component="a" 
          href="mailto:mgfiton00@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Email />
        </IconButton>
        
        {/* <IconButton 
          component="a" 
          href="https://www.linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <LinkedIn />
        </IconButton>
         */}
        <IconButton 
          component="a" 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <Instagram />
        </IconButton>
      </Box>
      
      <Box>
        <Typography
          component="a"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: '#64b5f6',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '1rem',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: '#90caf9',
              textDecoration: 'underline'
            }
          }}
        >
          manuel &#9794;
        </Typography>
      </Box>
    </Box>
  );
};
export default Footer;