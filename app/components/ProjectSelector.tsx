'use client';

import { useState, useRef, useEffect } from 'react';
import { Project } from '../types/project';
import { useRouter } from 'next/navigation';
import { setCurrentProject, generateSampleProject } from '../actions/project';
import { ChevronDownIcon, PlusIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface ProjectSelectorProps {
  projects: Project[];
  currentProject: Project | null;
}

export default function ProjectSelector({ projects, currentProject }: ProjectSelectorProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProjectSelect = async (projectId: string) => {
    try {
      setIsLoading(true);
      const result = await setCurrentProject(projectId);
      
      if (result.success) {
        window.location.href = '/';
      } else {
        throw new Error('Failed to set current project');
      }
    } catch (error) {
      console.error('Error selecting project:', error);
      alert('Failed to switch project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSample = async () => {
    try {
      if (status === 'loading') {
        return;
      }

      if (!session) {
        router.push('/api/auth/signin');
        return;
      }

      setIsLoading(true);
      const sampleProject = await generateSampleProject();
      if (sampleProject) {
        window.location.href = '/settings';
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating sample project:', error);
      if (error instanceof Error && error.message.includes('sign in')) {
        router.push('/api/auth/signin');
      } else {
        alert('Failed to generate sample project. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="truncate max-w-[160px]">{currentProject?.name || 'Select a project'}</span>
        <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <div className="py-1">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectSelect(project.id)}
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                disabled={isLoading}
              >
                {project.name}
              </button>
            ))}
            
            <div className="border-t border-gray-100 mt-1">
              <Link
                href="/create"
                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <PlusIcon className="w-5 h-5 mr-2 text-gray-400" />
                New Project
              </Link>
              
              <button
                onClick={handleGenerateSample}
                disabled={isLoading}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <DocumentDuplicateIcon className="w-5 h-5 mr-2 text-gray-400" />
                New Sample Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 