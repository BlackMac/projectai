'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function BuildProjectButton() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    router.push('/create');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <PlusIcon className="h-5 w-5 mr-2" />
      Build Project
    </button>
  );
} 