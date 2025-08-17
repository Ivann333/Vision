import styled from "styled-components";

const Title = styled.h1`
  font-size: 2rem;
  color: #222;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #555;
`;

function Home() {
  return (
    <div>
      <Title>Welcome to Vision App</Title>
      <Description>
        This is the home page. Start building your vision here!
      </Description>
    </div>
  );
}

export default Home;
