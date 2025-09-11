import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTextEditorClick = () => {
    navigate('/edit-text');
  };

  const isTextEditorActive = location.pathname === '/edit-text';

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-content">
        <div className="logo-container">
          <h1 className="logo">fileSwitch</h1>
        </div>
        
        <div className="header-actions">
          <button
            className={`text-editor-button ${isTextEditorActive ? 'active' : ''}`}
            onClick={handleTextEditorClick}
            title="Go to Text Editor"
          >
            <svg className="text-editor-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 5H21M3 12H21M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 5V19M17 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11 5V19M13 5V19" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span className="button-text">Text Editor</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;