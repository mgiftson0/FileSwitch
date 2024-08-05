import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import Home from './pages/Home';
import TextEditorPage from './pages/TextEditorPage';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-text" element={<TextEditorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
