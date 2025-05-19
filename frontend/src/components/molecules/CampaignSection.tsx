import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import PrimaryButton from '../atoms/PrimaryButton';

export default function CampaignSection() {
  return (
    <Box mt={6} textAlign="center">
      <Typography variant="h4" gutterBottom>
        Campañas existentes
      </Typography>

      <Stack direction="row" justifyContent="center">
        <PrimaryButton label="Crear nueva campaña" />
      </Stack>
    </Box>
  );
}
