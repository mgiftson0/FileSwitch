import Header from '../components/common/Header';
import UploadForm from '../components/home/UploadForm';
import { Box } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="gradient-bg"></div>

      <Header />

      <Box
        className="fade-in"
        sx={{
          width: '100%',
          maxWidth: 'lg',
          px: { xs: 2, md: 4 },
          pt: { xs: 14, md: 18 },
          pb: { xs: 4, md: 8 },
          flex: 1,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <UploadForm />
      </Box>
    </Box>
  );
};

export default Home;