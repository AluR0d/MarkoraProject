import TextField from '@mui/material/TextField';

type Props = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
}: Props) {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      variant="outlined"
    />
  );
}
