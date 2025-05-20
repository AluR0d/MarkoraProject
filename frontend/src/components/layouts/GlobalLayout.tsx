import { Outlet } from 'react-router-dom';
import MainNavbar from '../organisms/MainNavbar';
import Container from '@mui/material/Container';

export default function GlobalLayout() {
  return (
    <>
      <MainNavbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
