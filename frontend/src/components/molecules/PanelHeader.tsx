import { Box, Button, Typography } from '@mui/material';

type Props = {
  title: string;
  onCreate: () => void;
};

export default function PanelHeader({ title, onCreate }: Props) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h6">{title}</Typography>
      <Button variant="contained" color="primary" onClick={onCreate}>
        ➕ Crear usuario
      </Button>
    </Box>
  );
}
