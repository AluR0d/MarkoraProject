import { Outlet } from 'react-router-dom';
import MainNavbar from '../organisms/MainNavbar';
import Container from '@mui/material/Container';
import FancyNavbar from '../organisms/FancyNavbar';

export default function GlobalLayout() {
  return (
    <>
      {/* <MainNavbar /> */}
      <FancyNavbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
