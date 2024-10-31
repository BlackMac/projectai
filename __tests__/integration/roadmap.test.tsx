import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RoadmapView } from '@/app/components/RoadmapView';
import { createMilestone, updateMilestone } from '@/app/actions/roadmap';

// Mock the roadmap actions
jest.mock('@/app/actions/roadmap');

describe('RoadmapView Integration', () => {
  const mockMilestones = [
    {
      id: '1',
      title: 'MVP Release',
      description: 'Initial release with core features',
      dueDate: new Date('2024-12-31'),
      status: 'IN_PROGRESS',
      projectId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  beforeEach(() => {
    (createMilestone as jest.Mock).mockResolvedValue({ id: '2' });
    (updateMilestone as jest.Mock).mockResolvedValue({ success: true });
  });

  it('displays roadmap milestones correctly', () => {
    render(<RoadmapView projectId="1" milestones={mockMilestones} />);
    
    expect(screen.getByText('MVP Release')).toBeInTheDocument();
    expect(screen.getByText('Initial release with core features')).toBeInTheDocument();
    expect(screen.getByText('IN_PROGRESS')).toBeInTheDocument();
  });

  it('allows updating milestone status', async () => {
    render(<RoadmapView projectId="1" milestones={mockMilestones} />);
    
    const statusButton = screen.getByText('IN_PROGRESS');
    fireEvent.click(statusButton);
    
    const completeOption = screen.getByText('COMPLETED');
    fireEvent.click(completeOption);
    
    await waitFor(() => {
      expect(updateMilestone).toHaveBeenCalledWith({
        id: '1',
        status: 'COMPLETED'
      });
    });
  });
}); 