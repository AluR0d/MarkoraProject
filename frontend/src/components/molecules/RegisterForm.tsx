import { useState } from 'react';
import TextInput from '../atoms/TextInput';
import SubmitButton from '../atoms/SubmitButton';
import FormTitle from '../atoms/FormTitle';

type Props = {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
  isLoading?: boolean;
  errorMessage?: string;
};

export default function RegisterForm({
  onSubmit,
  isLoading = false,
  errorMessage,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormTitle text="Create account" />
      <TextInput
        label="Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextInput
        label="Email address"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextInput
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <SubmitButton
        label={isLoading ? 'Signing in...' : 'Sign in'}
        disabled={isLoading}
      />
      {errorMessage && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>
          {errorMessage}
        </p>
      )}
    </form>
  );
}
