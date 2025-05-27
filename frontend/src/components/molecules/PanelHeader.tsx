import { ReactNode } from 'react';

type PanelHeaderProps = {
  title: string;
  onCreate?: () => void;
  children?: ReactNode;
};

export default function PanelHeader({
  title,
  onCreate,
  children,
}: PanelHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] font-mono">
        {title}
      </h2>

      {onCreate && (
        <button
          onClick={onCreate}
          className="self-start cursor-pointer sm:self-auto bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-accent)] transition text-sm font-medium"
        >
          {children}
        </button>
      )}
    </div>
  );
}
