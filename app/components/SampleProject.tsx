'use client';

import { ArrowRightIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProjectFromTemplate } from '../actions/project';

const sampleProject = {
  name: "E-Commerce Dashboard",
  description: "A sample project demonstrating an AI-powered e-commerce analytics dashboard with real-time data visualization and predictive analytics.",
  constraints: "- Must be mobile responsive\n- Accessibility compliance (WCAG 2.1)\n- Performance budget: < 3s initial load\n- Support latest 2 versions of major browsers\n- SEO optimized\n- Server-side rendering for critical paths",
  codeGuidelines: "- Next.js 14+ with App Router\n- TypeScript for type safety\n- Tailwind CSS for styling\n- Component-driven development\n- Unit testing with Jest and React Testing Library\n- E2E testing with Playwright\n- Follow Next.js best practices for routing and data fetching",
  productBrief: "Create a modern e-commerce dashboard that helps store owners track sales, inventory, and customer behavior. The dashboard should leverage Next.js server components for optimal performance and Tailwind CSS for a responsive design. AI-powered analytics will be integrated using server actions.",
  techStack: {
    framework: "Next.js 14+",
    language: "TypeScript",
    styling: "Tailwind CSS",
    testing: ["Jest", "React Testing Library", "Playwright"],
    deployment: "Vercel",
    features: [
      "App Router",
      "Server Components",
      "Server Actions",
      "API Routes",
      "Middleware",
      "Edge Runtime"
    ]
  }
};

export default function SampleProject() {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleUseSample = async () => {
    try {
      setIsCreating(true);
      
      const result = await createProjectFromTemplate(sampleProject);
      
      if (result.success) {
        // Refresh the page data
        router.refresh();
        
        // Redirect to the project settings
        router.push('/settings');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DocumentDuplicateIcon className="h-8 w-8 text-indigo-600" />
            <h3 className="ml-3 text-xl font-semibold text-gray-900">{sampleProject.name}</h3>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            Sample
          </span>
        </div>
        <p className="mt-4 text-gray-600">{sampleProject.description}</p>
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
            {sampleProject.techStack.framework}
          </span>
          <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
            {sampleProject.techStack.language}
          </span>
          <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
            {sampleProject.techStack.styling}
          </span>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Project Constraints</h4>
          <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded">
            {sampleProject.constraints}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">Code Guidelines</h4>
          <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded">
            {sampleProject.codeGuidelines}
          </pre>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">Next.js Features</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {sampleProject.techStack.features.map((feature) => (
              <span 
                key={feature}
                className="px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-500">
              Use this sample project to explore the features of our AI-powered Next.js project management system.
            </p>
          </div>
          <div className="ml-6 flex items-center space-x-3">
            <button
              onClick={handleUseSample}
              disabled={isCreating}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Project...
                </>
              ) : (
                'Use Template'
              )}
            </button>
            <Link
              href="/create"
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isCreating ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              Create Custom
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 