import Button from '@mui/material/Button';

type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function SubmitButton({
  label,
  onClick,
  disabled = false,
}: Props) {
  return (
    <Button
      variant="contained"
      color="primary"
      type="submit"
      onClick={onClick}
      disabled={disabled}
      fullWidth
    >
      {label}
    </Button>
  );
}
