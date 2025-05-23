import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
return (
    <AppBar 
      position="fixed"
      sx={{
        top: 10,
        zIndex: 1100,
        background: `
          linear-gradient(135deg, rgba(10, 25, 41, 0.9), rgba(15, 35, 55, 0.85)),
          radial-gradient(circle at 20% 50%, rgba(100, 181, 246, 0.1), transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(187, 222, 251, 0.08), transparent 50%)
        `,
        width: '90%',
        height: { xs: '45px', sm: '55px' },
        margin: '10px auto',
        padding: { xs: '10px', sm: '14px' },
        borderRadius: '20px',
        backdropFilter: 'blur(15px)',
        boxShadow: `
          0 4px 20px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2),
          inset 2px 0 8px rgba(100, 181, 246, 0.1),
          inset -2px 0 8px rgba(187, 222, 251, 0.08),
          inset 0 2px 12px rgba(255, 255, 255, 0.05)
        `,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, 
              transparent 0%, 
              rgba(100, 181, 246, 0.03) 25%, 
              rgba(187, 222, 251, 0.05) 50%, 
              rgba(100, 181, 246, 0.03) 75%, 
              transparent 100%
            )
          `,
          borderRadius: '20px',
          pointerEvents: 'none'
        },
        '&:hover': {
          boxShadow: `
            0 6px 28px rgba(0, 0, 0, 0.4),
            0 2px 12px rgba(100, 181, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.25),
            inset 0 -1px 0 rgba(0, 0, 0, 0.3),
            inset 3px 0 12px rgba(100, 181, 246, 0.15),
            inset -3px 0 12px rgba(187, 222, 251, 0.12),
            inset 0 3px 16px rgba(255, 255, 255, 0.08)
          `,
          borderColor: 'rgba(255, 255, 255, 0.25)',
          transform: 'translateY(-1px)',
          background: `
            linear-gradient(135deg, rgba(12, 28, 45, 0.92), rgba(18, 40, 62, 0.88)),
            radial-gradient(circle at 20% 50%, rgba(100, 181, 246, 0.15), transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(187, 222, 251, 0.12), transparent 50%)
          `
        }
      }}
    >
      <Toolbar sx={{ 
        minHeight: { xs: '25px', sm: '30px' },
        padding: { xs: '0 8px', sm: '0 12px' },
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1
      }}>
        <Typography 
          variant="h5"
          sx={{
            fontWeight: 500,
            letterSpacing: { xs: '0.8px', sm: '1.2px' },
            fontFamily: '"Poppins", "Roboto", sans-serif',
            color: 'white',
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: { xs: '1.1rem', sm: '1.5rem' },
            background: 'linear-gradient(135deg, #64b5f6 0%, #90caf9 25%, #bbdefb 50%, #e3f2fd 75%, #64b5f6 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 8px rgba(100, 181, 246, 0.3)',
            animation: 'gradientShift 4s ease-in-out infinite',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(-50%) scale(1.02)',
              filter: 'brightness(1.1)'
            },
            '@keyframes gradientShift': {
              '0%, 100%': {
                backgroundPosition: '0% 50%'
              },
              '50%': {
                backgroundPosition: '100% 50%'
              }
            }
          }}
        >
          fileSwitch
        </Typography>
        
        <Box sx={{ width: { xs: '80px', sm: '120px' } }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;