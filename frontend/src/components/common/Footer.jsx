import { Box, Typography, IconButton } from '@mui/material';
import { GitHub, Email, } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a1625',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '12px 16px',
        textAlign: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 1, sm: 4 }
      }}>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 400,
            fontSize: '0.75rem'
          }}
        >
          © 2025 manuel. All rights reserved.
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            component="a"
            href="https://github.com/mgiftson0"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              padding: '6px',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#3a86ff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            <GitHub sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            component="a"
            href="mailto:mgfiton00@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              padding: '6px',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#3a86ff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            <Email sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Typography
          component="a"
          href="/"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.75rem',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#3a86ff'
            }
          }}
        >
          manuel ♂
        </Typography>
      </Box>
    </Box>
  );
};
export default Footer;