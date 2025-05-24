import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography, Paper } from '@mui/material';
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

  const handleChange = (_: any, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3}>
        <Box p={2}>
          <Typography variant="h4" gutterBottom>
            {t('admin.title')}
          </Typography>

          <Tabs value={tab} onChange={handleChange} indicatorColor="primary">
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
