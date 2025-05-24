import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import PrimaryButton from '../atoms/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CampaignSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box mt={6} textAlign="center">
      <Stack direction="row" justifyContent="center">
        <PrimaryButton
          label={t('campaign.create_new')}
          onClick={() => navigate('/campaign/create')}
        />
      </Stack>
    </Box>
  );
}
