import { useState } from 'react';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import UserAdminPanel from '../organisms/UserAdminPanel';
import PlaceAdminPanel from '../organisms/PlaceAdminPanel';
import DashboardAdminPanel from '../organisms/DashboardAdminPanel';

function TabPanel({ value, index, children }: any) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState(0);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (_: any, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: isMobile ? 10 : 12,
        mb: 6,
      }}
    >
      <Paper elevation={3}>
        <Box p={3}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            className="text-[var(--color-primary)] font-bold mb-4 break-words leading-snug"
          >
            {t('admin.title')}
          </Typography>

          <Tabs
            value={tab}
            variant="scrollable"
            scrollButtons={isMobile ? 'auto' : false}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 2 }}
          >
            <Tab label={t('admin.tabs.users')} />
            <Tab label={t('admin.tabs.places')} />
            <Tab label={t('admin.tabs.dashboard')} />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <UserAdminPanel />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <PlaceAdminPanel />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <DashboardAdminPanel />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}
