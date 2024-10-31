'use client';

import { generateSampleProject } from '@/app/actions/project';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface GenerateSampleButtonProps {
  onSampleGenerated: () => void;
}

export function GenerateSampleButton({ onSampleGenerated }: GenerateSampleButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = async () => {
    try {
      if (status === 'loading') {
        return;
      }

      if (!session?.user?.id) {
        console.log('Session state:', { session, status });
        router.push('/api/auth/signin');
        return;
      }

      const sampleProject = await generateSampleProject();
      if (sampleProject) {
        onSampleGenerated();
        window.location.href = '/settings';
      }
    } catch (error) {
      console.error('Failed to generate sample project:', error);
      if (error instanceof Error && error.message.includes('sign in')) {
        console.log('Session state at error:', { session, status });
        router.push('/api/auth/signin');
      } else {
        alert('Failed to generate sample project. Please try again.');
      }
    }
  };

  if (status === 'loading') {
    return (
      <button
        disabled
        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md opacity-50"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
    >
      Generate Sample Project
    </button>
  );
} 