'use client';

import { useState, useEffect } from 'react';
import { getBacklogForPhase } from '../actions/backlog';
import Link from 'next/link';

interface BacklogLinkProps {
  phaseId: string;
  refreshTrigger?: number;
}

export function BacklogLink({ phaseId, refreshTrigger = 0 }: BacklogLinkProps) {
  const [hasBacklog, setHasBacklog] = useState(false);

  useEffect(() => {
    const checkBacklog = async () => {
      const backlog = await getBacklogForPhase(phaseId);
      setHasBacklog(!!backlog);
    };
    checkBacklog();
  }, [phaseId, refreshTrigger]);

  if (!hasBacklog) return null;

  return (
    <Link
      href={`/planning/backlog/${phaseId}`}
      className="inline-flex items-center px-2 py-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
    >
      <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
      View Backlog
    </Link>
  );
} 