import { IconButton } from '@mui/material';
import { GitHub, Email, LinkedIn, Instagram } from '@mui/icons-material';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#f5f5f5',
      padding: '20px 10px',  
      textAlign: 'center',
      borderTop: '1px solid #ddd',
      fontFamily: 'gil-sans, arial',
      width: '100%', 
      boxSizing: 'border-box',
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)',
    }}>
      <p>© 2024 manuel. All rights reserved.</p>
      <div style={{ margin: '10px 0' }}>
        <IconButton component="a" href="https://github.com/mgiftson0" target="_blank" rel="noopener noreferrer">
          <GitHub />
        </IconButton>
        <IconButton component="a" href="mailto:mgfiton00@gmail.com" target="_blank" rel="noopener noreferrer">
          <Email />
        </IconButton>
        <IconButton component="a" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
          <LinkedIn />
        </IconButton>
        <IconButton component="a" href="https://www.instagram.com/msabali_" target="_blank" rel="noopener noreferrer">
          <Instagram />
        </IconButton>
      </div>
      <div>
        <a href="https://sabali-mu.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>
          manuel &#9794;
        </a>
      </div>
    </footer>
  );
};

export default Footer;
