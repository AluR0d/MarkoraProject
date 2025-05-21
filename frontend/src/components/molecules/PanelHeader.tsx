import { Box, Button, Typography } from '@mui/material';
import React from 'react';

type Props = {
  title: string;
  onCreate: () => void;
  children: React.ReactNode;
};

export default function PanelHeader({ title, onCreate, children }: Props) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h6">{title}</Typography>
      <Button variant="contained" color="primary" onClick={onCreate}>
        {children}
      </Button>
    </Box>
  );
}
