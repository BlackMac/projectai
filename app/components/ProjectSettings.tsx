'use client';

import { Project } from '../types/project';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ProjectSettingsProps {
  project: Project;
  onUpdate: (updatedProject: Partial<Project>) => Promise<void>;
  onDelete: () => Promise<void>;
}

interface SettingsSection {
  title: string;
  fields: {
    key: keyof Project;
    label: string;
    type: 'input' | 'textarea';
    placeholder: string;
  }[];
}

export function ProjectSettings({ project, onUpdate, onDelete }: ProjectSettingsProps) {
  const [formData, setFormData] = useState<Partial<Project>>({
    name: project.name,
    description: project.description,
    productBrief: project.productBrief,
    techStack: Array.isArray(project.techStack) ? project.techStack : [],
    codeGuidelines: project.codeGuidelines,
    targetAudience: project.targetAudience,
    keyFeatures: project.keyFeatures,
    successMetrics: project.successMetrics,
    timeline: project.timeline,
    budget: project.budget,
    teamSize: project.teamSize,
    methodology: project.methodology,
    integrationRequirements: project.integrationRequirements,
    securityRequirements: project.securityRequirements,
    performanceRequirements: project.performanceRequirements,
    accessibilityRequirements: project.accessibilityRequirements,
    testingRequirements: project.testingRequirements,
    deploymentStrategy: project.deploymentStrategy,
    maintenancePlan: project.maintenancePlan,
    constraints: project.constraints,
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Core Information': true,
    'Technical Details': false,
    'Project Parameters': false,
    'Requirements': false,
    'Implementation': false,
  });

  const sections: SettingsSection[] = [
    {
      title: 'Core Information',
      fields: [
        { key: 'name', label: 'Project Name', type: 'input', placeholder: 'Project name' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Project description' },
        { key: 'productBrief', label: 'Product Brief', type: 'textarea', placeholder: 'Product brief' },
      ],
    },
    {
      title: 'Technical Details',
      fields: [
        { key: 'codeGuidelines', label: 'Code Guidelines', type: 'textarea', placeholder: 'Code guidelines and standards' },
      ],
    },
    {
      title: 'Project Parameters',
      fields: [
        { key: 'targetAudience', label: 'Target Audience', type: 'input', placeholder: 'Target audience' },
        { key: 'keyFeatures', label: 'Key Features', type: 'textarea', placeholder: 'Key features' },
        { key: 'successMetrics', label: 'Success Metrics', type: 'textarea', placeholder: 'Success metrics' },
        { key: 'timeline', label: 'Timeline', type: 'input', placeholder: 'Project timeline' },
        { key: 'budget', label: 'Budget', type: 'input', placeholder: 'Project budget' },
        { key: 'teamSize', label: 'Team Size', type: 'input', placeholder: 'Team size' },
        { key: 'methodology', label: 'Development Methodology', type: 'input', placeholder: 'Development methodology' },
      ],
    },
    {
      title: 'Requirements',
      fields: [
        { key: 'integrationRequirements', label: 'Integration Requirements', type: 'textarea', placeholder: 'Integration requirements' },
        { key: 'securityRequirements', label: 'Security Requirements', type: 'textarea', placeholder: 'Security requirements' },
        { key: 'performanceRequirements', label: 'Performance Requirements', type: 'textarea', placeholder: 'Performance requirements' },
        { key: 'accessibilityRequirements', label: 'Accessibility Requirements', type: 'textarea', placeholder: 'Accessibility requirements' },
        { key: 'testingRequirements', label: 'Testing Requirements', type: 'textarea', placeholder: 'Testing requirements' },
      ],
    },
    {
      title: 'Implementation',
      fields: [
        { key: 'deploymentStrategy', label: 'Deployment Strategy', type: 'textarea', placeholder: 'Deployment strategy' },
        { key: 'maintenancePlan', label: 'Maintenance Plan', type: 'textarea', placeholder: 'Maintenance plan' },
        { key: 'constraints', label: 'Constraints', type: 'textarea', placeholder: 'Project constraints' },
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      toast.success('Project settings updated successfully');
    } catch (error) {
      toast.error('Failed to update project settings');
    }
  };

  const handleChange = (field: keyof Project, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTechStackChange = (value: string) => {
    try {
      const techStackArray = value.split(',').map(item => item.trim()).filter(Boolean);
      handleChange('techStack', techStackArray);
    } catch (error) {
      console.error('Error parsing tech stack:', error);
    }
  };

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      await onDelete();
      toast.success('Project deleted successfully');
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {sections.map((section) => (
        <div key={section.title} className="border rounded-lg shadow-sm bg-white">
          <button
            type="button"
            onClick={() => toggleSection(section.title)}
            className="w-full px-4 py-3 flex items-center justify-between text-left text-lg font-medium border-b focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {section.title}
            {expandedSections[section.title] ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {expandedSections[section.title] && (
            <div className="p-4 space-y-4">
              {section.title === 'Technical Details' && (
                <div className="mb-4">
                  <label className="text-sm font-medium">Tech Stack (comma-separated)</label>
                  <Input
                    value={Array.isArray(formData.techStack) ? formData.techStack.join(', ') : ''}
                    onChange={e => handleTechStackChange(e.target.value)}
                    placeholder="React, Next.js, TypeScript"
                    className="mt-1"
                  />
                </div>
              )}

              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium">{field.label}</label>
                  {field.type === 'input' ? (
                    <Input
                      value={formData[field.key] as string}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-1"
                    />
                  ) : (
                    <Textarea
                      value={formData[field.key] as string}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={`mt-1 ${
                        (field.key === 'description' || field.key === 'productBrief') 
                          ? 'min-h-[200px]' 
                          : 'min-h-[100px]'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="sticky bottom-4 flex justify-between bg-white p-4 border rounded-lg shadow-lg">
        <Button 
          variant="destructive" 
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          Delete Project
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Project</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDelete();
                  setShowDeleteConfirm(false);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Project
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
} 