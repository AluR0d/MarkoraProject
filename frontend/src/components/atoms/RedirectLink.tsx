import { Link } from 'react-router-dom';

type Props = {
  question: string;
  linkText: string;
  to: string;
  className?: string;
};

export default function RedirectLink({
  question,
  linkText,
  to,
  className = '',
}: Props) {
  return (
    <p className={`text-sm ${className}`}>
      {question}{' '}
      <Link
        to={to}
        className="text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
      >
        {linkText}
      </Link>
    </p>
  );
}
