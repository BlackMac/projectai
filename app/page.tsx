'use client';

import { useSession } from 'next-auth/react';
import LandingPage from './components/LandingPage';
import { useState, useEffect } from 'react';
import { Project } from './types/project';
import { getCurrentProject, getProjects, setCurrentProject } from './actions/project';
import ProjectOverview from './components/ProjectOverview';
import BuildProjectButton from './components/BuildProjectButton';
import { GenerateSampleButton } from './components/GenerateSampleButton';

export default function HomePage() {
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProject = async () => {
    const currentProject = await getCurrentProject();
    setProject(currentProject);
  };

  const fetchProjects = async () => {
    const allProjects = await getProjects();
    setProjects(allProjects);
  };

  useEffect(() => {
    if (session) {
      fetchProject();
      fetchProjects();
    }
  }, [session]);

  const handleProjectClick = async (projectId: string) => {
    try {
      setIsLoading(true);
      const result = await setCurrentProject(projectId);
      
      if (result.success) {
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

  const handleSampleGenerated = () => {
    fetchProject();
  };

  // Show landing page for unauthenticated users
  if (!session) {
    return <LandingPage />;
  }

  // Show project selection or current project for authenticated users
  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="mt-2 text-gray-600">Select an existing project or create a new one.</p>
        
        <div className="mt-8 max-w-3xl mx-auto">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              className={`bg-white p-4 rounded-lg shadow-sm mb-4 text-left cursor-pointer hover:shadow-md transition-shadow ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => !isLoading && handleProjectClick(proj.id)}
            >
              <h3 className="font-semibold text-lg">{proj.name}</h3>
              <p className="text-gray-600 mt-1">{proj.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <BuildProjectButton />
        </div>
        <div className="mt-4">
          <GenerateSampleButton onSampleGenerated={handleSampleGenerated} />
        </div>
      </div>
    );
  }

  return <ProjectOverview project={project} />;
}
