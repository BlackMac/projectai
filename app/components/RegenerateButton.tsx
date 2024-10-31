'use client';

import { regenerateRoadmap } from "@/app/actions/roadmap";
import { useState } from "react";
import { useRouter } from 'next/navigation';

interface RegenerateButtonProps {
  projectId: string;
  isRegenerate: boolean;
  onRegenerateComplete: () => Promise<void>;
}

export function RegenerateButton({ projectId, isRegenerate, onRegenerateComplete }: RegenerateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegenerate = async () => {
    try {
      setIsLoading(true);
      await regenerateRoadmap(projectId);
      router.refresh(); // Refresh the page data
      onRegenerateComplete?.(); // Call the callback if provided
    } catch (error) {
      console.error('Failed to regenerate roadmap:', error);
      // You might want to add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRegenerate}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Regenerating...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isRegenerate ? 'Regenerate Roadmap' : 'Generate Roadmap'}
        </>
      )}
    </button>
  );
} 