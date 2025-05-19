import { useState } from 'react';
import { Box, Container, Tab, Tabs, Typography, Paper } from '@mui/material';
import UserAdminPanel from '../organisms/UserAdminPanel';
import PlaceAdminPanel from '../organisms/PlaceAdminPanel';

function TabPanel({ value, index, children }: any) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState(0);

  const handleChange = (_: any, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3}>
        <Box p={2}>
          <Typography variant="h4" gutterBottom>
            Panel de administración
          </Typography>

          <Tabs value={tab} onChange={handleChange} indicatorColor="primary">
            <Tab label="Usuarios 👤" />
            <Tab label="Places 📍" />
            <Tab label="Dashboard 📊" />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <UserAdminPanel />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <PlaceAdminPanel />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Typography>Dashboard con estadísticas aquí.</Typography>
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}
