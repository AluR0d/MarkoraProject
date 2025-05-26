type Props = {
  text: string;
};

export default function FormTitle({ text }: Props) {
  return (
    <h2 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-3">
      {text}
    </h2>
  );
}
