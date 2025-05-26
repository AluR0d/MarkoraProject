type Props = {
  title: string;
  onCreate: () => void;
  children: React.ReactNode;
};

export default function PanelHeader({ title, onCreate, children }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-[var(--color-primary)]">
        {title}
      </h2>
      <button
        onClick={onCreate}
        className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md
                 hover:bg-[var(--color-accent)] transition-colors cursor-pointer text-sm font-medium"
      >
        {children}
      </button>
    </div>
  );
}
