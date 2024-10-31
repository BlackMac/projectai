'use client';

export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      Copy
    </button>
  );
} 