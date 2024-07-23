import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  * {
    box-sizing: border-box;
  }
    .page-break {
  page-break-before: always;
  margin: 20px 0;
  border-top: 1px dashed #ddd;
}
  .page-break {
  page-break-before: always;
  margin: 20px 0;
  border-top: 1px dashed #ddd;
}

.footer {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: center;
  border-top: 1px solid #ddd;
}


`;

export default GlobalStyles;
