interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2">
      <div className="text-xl font-bold text-red-600">Error</div>
      <div className="text-sm text-gray-600">{message}</div>
    </div>
  );
}
