import Container from '@mui/material/Container';
import CampaignSection from '../molecules/CampaignSection';
import PrimaryButton from '../atoms/PrimaryButton';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Container maxWidth="md">
        <CampaignSection />
        <PrimaryButton
          label="Mis campañas"
          onClick={() => navigate('/my-campaigns')}
        />
      </Container>
    </>
  );
}
