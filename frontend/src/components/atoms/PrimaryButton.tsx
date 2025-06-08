type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

export default function PrimaryButton({
  label,
  onClick,
  disabled = false,
  type = 'button',
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-[var(--color-primary)] text-white font-medium py-2 px-4
                 rounded-md hover:bg-[var(--color-accent)] transition-colors
                 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
    >
      {disabled && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {label}
    </button>
  );
}
