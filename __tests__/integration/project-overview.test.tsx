import { render, screen } from '@testing-library/react';
import { ProjectOverview } from '@/app/components/ProjectOverview';
import { useSession } from 'next-auth/react';
import { Project } from '@/app/types/project';

// Mock next-auth
jest.mock('next-auth/react');

const mockProject: Project = {
  id: '1',
  name: 'Test Project',
  description: 'A test project',
  productBrief: 'Product brief',
  keyFeatures: 'Key features',
  successMetrics: 'Success metrics',
  targetAudience: 'Target audience',
  timeline: '3 months',
  teamSize: '5 people',
  methodology: 'Agile',
  techStack: JSON.stringify(['React', 'Node.js']),
  codeGuidelines: 'Code guidelines',
  userId: 'user1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProjectOverview Integration', () => {
  it('shows landing page when user is not logged in', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    render(<ProjectOverview project={mockProject} />);
    
    expect(screen.getByText('AI-Powered SAAS Project Manager')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('shows project details when user is logged in', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: 'user1' } },
      status: 'authenticated'
    });

    render(<ProjectOverview project={mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project')).toBeInTheDocument();
    expect(screen.getByText('Product brief')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });
}); 