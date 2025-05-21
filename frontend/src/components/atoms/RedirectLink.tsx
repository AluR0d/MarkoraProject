import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

type Props = {
  question: string;
  linkText: string;
  to: string;
};

export default function RedirectLink({ question, linkText, to }: Props) {
  return (
    <Typography variant="body2" mt={2}>
      {question}{' '}
      <Link to={to} style={{ textDecoration: 'none', color: '#1976d2' }}>
        {linkText}
      </Link>
    </Typography>
  );
}
