'use client';

import { Project } from '../types/project';
import { DownloadBriefButton } from './DownloadBriefButton';
import { useSession } from "next-auth/react";
import LandingPage from "./LandingPage";

interface ProjectOverviewProps {
  project: Project;
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  const { data: session } = useSession();

  // If user is not logged in, show landing page
  if (!session) {
    return <LandingPage />;
  }

  const getTechStack = (): string[] => {
    try {
      if (Array.isArray(project.techStack)) {
        return project.techStack;
      }
      if (typeof project.techStack === 'string') {
        const parsed = JSON.parse(project.techStack);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing techStack:', error);
      return [];
    }
  };

  const techStack = getTechStack();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="mt-2 text-lg text-gray-600">{project.description}</p>
            </div>
            <DownloadBriefButton projectId={project.id} projectName={project.name} />
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Project Overview</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product Brief</h3>
                  <p className="mt-2 text-gray-900">{project.productBrief}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Key Features</h3>
                  <p className="mt-2 text-gray-900">{project.keyFeatures}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Success Metrics</h3>
                  <p className="mt-2 text-gray-900">{project.successMetrics}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Project Details</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Target Audience</h3>
                  <p className="mt-1 text-gray-900">{project.targetAudience}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                  <p className="mt-1 text-gray-900">{project.timeline}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Team Size</h3>
                  <p className="mt-1 text-gray-900">{project.teamSize}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Methodology</h3>
                  <p className="mt-1 text-gray-900">{project.methodology}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Tech Stack</h3>
                {techStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No tech stack specified</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-4">Development Guidelines</h3>
                <p className="text-gray-900">{project.codeGuidelines}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 