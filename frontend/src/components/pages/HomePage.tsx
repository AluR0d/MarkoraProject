import Container from '@mui/material/Container';
import MainNavbar from '../organisms/MainNavbar';
import CampaignSection from '../molecules/CampaignSection';

export default function HomePage() {
  return (
    <>
      <MainNavbar />
      <Container maxWidth="md">
        <CampaignSection />
      </Container>
    </>
  );
}
