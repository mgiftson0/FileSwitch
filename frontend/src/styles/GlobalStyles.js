import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', 'Roboto', sans-serif;
    background-color: #0a1625; /* Deep navy blue background */
    color: #e6f1ff; /* Soft blue-white text */
    min-height: 100vh;
    line-height: 1.6;
  }
  
  
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    color: #ffffff; /* White headings */
  }

  a {
    text-decoration: none;
    color:rgb(0, 122, 223); /* Light blue links */
    &:hover {
      color: #bbdefb; /* Lighter blue on hover */
    }
  }

  * {
    box-sizing: border-box;
  }

  /* Dark theme scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #1e1e1e; /* Dark gray */
  }
  ::-webkit-scrollbar-thumb {
    background: #424242; /* Medium gray */
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #616161; /* Lighter gray */
  }

  .page-break {
    page-break-before: always;
    margin: 20px 0;
    border-top: 1px dashed #424242; /* Medium gray */
  }

  .footer {
    background-color: #0a1929; /* Dark blue */
    padding: 16px;
    text-align: center;
    border-top: 1px solid #1e1e1e; /* Dark gray */
    color: #ffffff; /* White text */
  }

  /* Additional dark theme elements */
  input, textarea, select {
    background-color: #1e1e1e; /* Dark gray */
    color: #ffffff; /* White text */
    border: 1px solid #424242; /* Medium gray */
    padding: 8px 12px;
    border-radius: 4px;
    &:focus {
      outline: 1px solid #64b5f6; /* Light blue */
    }
  }

  button {
    background-color: #0a1929; /* Dark blue */
    color: #ffffff; /* White text */
    border: 1px solid #64b5f6; /* Light blue */
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #1e3a8a; /* Darker blue */
    }
  }
`;

export default GlobalStyles;