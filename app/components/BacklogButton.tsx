'use client';

import { useState, useEffect } from 'react';
import { getBacklogForPhase, generateBacklogForPhase } from '../actions/backlog';
import { RoadmapPhase } from '../types/roadmap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface BacklogButtonProps {
  phase: RoadmapPhase;
  onBacklogGenerated?: () => void;
}

export function BacklogButton({ phase, onBacklogGenerated }: BacklogButtonProps) {
  const [hasBacklog, setHasBacklog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkBacklog = async () => {
      const backlog = await getBacklogForPhase(phase.id);
      setHasBacklog(!!backlog);
    };
    checkBacklog();
  }, [phase.id]);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await generateBacklogForPhase(phase.id, phase);
      setHasBacklog(true);
      setShowSuccess(true);
      router.refresh();
      onBacklogGenerated?.();
    } catch (error) {
      console.error('Failed to generate backlog:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const SuccessCheckmark = () => (
    <div className="absolute -right-2 -top-2">
      <div className="bg-green-500 rounded-full p-1">
        <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  if (!hasBacklog) {
    return (
      <div className="relative">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="inline-flex items-center px-3 py-1 h-8 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-md transition-colors whitespace-nowrap"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Create Backlog
            </>
          )}
        </button>
        {showSuccess && <SuccessCheckmark />}
      </div>
    );
  }

  return (
    <div className="relative flex items-center">
      <Link
        href={`/planning/backlog/${phase.id}`}
        className={`inline-flex items-center px-3 py-1 h-8 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-l-md transition-colors whitespace-nowrap ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Regenerating...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Open Backlog
          </>
        )}
      </Link>

      <Menu as="div" className="relative">
        <Menu.Button 
          className="inline-flex items-center px-2 py-1 h-8 text-sm bg-indigo-700 hover:bg-indigo-800 text-white border-l border-indigo-500 rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isGenerating}
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700 disabled:opacity-50`}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Regenerate Backlog
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      {showSuccess && <SuccessCheckmark />}
    </div>
  );
} 