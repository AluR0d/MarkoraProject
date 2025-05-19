import Button from '@mui/material/Button';

type Props = {
  label: string;
  onClick?: () => void;
};

export default function PrimaryButton({ label, onClick }: Props) {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {label}
    </Button>
  );
}
