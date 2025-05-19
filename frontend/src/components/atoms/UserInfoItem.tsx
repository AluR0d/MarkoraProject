import Typography from '@mui/material/Typography';

type Props = {
  label: string;
  value: string | number;
};

export default function UserInfoItem({ label, value }: Props) {
  return (
    <Typography variant="body1">
      <strong>{label}:</strong> {value}
    </Typography>
  );
}
