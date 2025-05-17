type Props = {
  text: string;
};

export default function FormTitle({ text }: Props) {
  return <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>{text}</h2>;
}
