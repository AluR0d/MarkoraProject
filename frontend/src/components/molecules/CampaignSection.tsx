import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import PrimaryButton from '../atoms/PrimaryButton';
import { useNavigate } from 'react-router-dom';

export default function CampaignSection() {
  const navigate = useNavigate();

  return (
    <Box mt={6} textAlign="center">
      <Typography variant="h4" gutterBottom>
        Campañas existentes
      </Typography>

      <Stack direction="row" justifyContent="center">
        <PrimaryButton
          label="Crear nueva campaña"
          onClick={() => navigate('/campaign/create')}
        />
      </Stack>
    </Box>
  );
}
