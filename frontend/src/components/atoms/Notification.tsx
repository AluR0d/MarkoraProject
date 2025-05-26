type Props = {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
};

export default function Notification({
  message,
  type = 'success',
  onClose,
}: Props) {
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`px-4 py-3 rounded-md shadow-md text-sm font-medium transition-all
                ${
                  type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
      >
        <div className="flex items-center justify-between gap-4">
          <span>{message}</span>
          <button
            onClick={onClose}
            className="text-xs font-bold hover:opacity-70 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
