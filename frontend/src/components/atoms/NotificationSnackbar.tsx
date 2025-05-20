import { Snackbar, Alert } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
};

export default function NotificationSnackbar({
  open,
  onClose,
  message,
  severity = 'success',
}: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
