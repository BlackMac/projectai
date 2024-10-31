import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BacklogView } from '@/app/components/BacklogView';
import { createBacklogItem, updateBacklogItem } from '@/app/actions/backlog';

// Mock the backlog actions
jest.mock('@/app/actions/backlog');

describe('BacklogView Integration', () => {
  const mockBacklogItems = [
    {
      id: '1',
      title: 'Test Item',
      description: 'Test Description',
      status: 'TODO',
      priority: 'HIGH',
      projectId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  beforeEach(() => {
    (createBacklogItem as jest.Mock).mockResolvedValue({ id: '2' });
    (updateBacklogItem as jest.Mock).mockResolvedValue({ success: true });
  });

  it('displays backlog items correctly', () => {
    render(<BacklogView projectId="1" backlogItems={mockBacklogItems} />);
    
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('allows adding new backlog items', async () => {
    render(<BacklogView projectId="1" backlogItems={mockBacklogItems} />);
    
    const addButton = screen.getByText('Add Item');
    fireEvent.click(addButton);
    
    const titleInput = screen.getByPlaceholderText('Enter title');
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    
    fireEvent.change(titleInput, { target: { value: 'New Item' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(createBacklogItem).toHaveBeenCalledWith({
        title: 'New Item',
        description: 'New Description',
        projectId: '1'
      });
    });
  });
}); 