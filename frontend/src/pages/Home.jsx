import Header from '../components/Header';
import UploadForm from '../components/UploadForm';
import { Box } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#121212', 
        color: 'rgba(255, 255, 255, 0.87)', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 2 // Padding top
      }}
    >
      <Header />
      <Box
        sx={{
          width: '100%',
          maxWidth: 'md', // Matches MUI's breakpoint (around 900px)
          px: 2, // Horizontal padding
          py: 4, // Vertical padding
          flex: 1 // Takes remaining space
        }}
      >
        <UploadForm />
      </Box>
    </Box>
  );
};

export default Home;