import Header from '../components/Header';
import UploadForm from '../components/UploadForm';
import styled from 'styled-components';

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Home = () => {
  return (
    <div>
      <Header />
      <ContentContainer>
        <UploadForm />
      </ContentContainer>
    </div>
  );
};

export default Home;
