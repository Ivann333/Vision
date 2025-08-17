import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: #f7f7fa;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: #222;
  color: #fff;
  padding: 1rem 2rem;
  font-size: 1.5rem;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

function AppLayout() {
  return (
    <Container>
      <Header>Vision App</Header>
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}

export default AppLayout;
