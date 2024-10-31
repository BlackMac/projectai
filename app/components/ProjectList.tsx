'use client';

import { Project } from '../types/project';
import { useRouter } from 'next/navigation';
import { CalendarIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { setCurrentProject } from '../actions/project';
import { useState } from 'react';

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleProjectClick = async (projectId: string) => {
    try {
      setIsLoading(true);
      const result = await setCurrentProject(projectId);
      
      if (result.success) {
        // Force a full page refresh to settings
        window.location.href = '/settings';
      } else {
        throw new Error('Failed to set current project');
      }
    } catch (error) {
      console.error('Error selecting project:', error);
      alert('Failed to load project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (projects.length === 0) {
    return (
      <p className="text-gray-600 mb-6">No projects created yet. Get started with our sample project or create a new one.</p>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={() => !isLoading && handleProjectClick(project.id)}
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Created {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 