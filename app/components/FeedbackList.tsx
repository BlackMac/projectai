'use client';

import { useState } from 'react';
import { createSampleFeedback, toggleFeedbackImportance, deleteFeedback, createFeedback } from '../actions/feedback';
import { useRouter } from 'next/navigation';
import { StarIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import AddFeedbackForm from './AddFeedbackForm';

interface Feedback {
  id: string;
  subject: string;
  content: string;
  sender?: string | null;
  isUserWritten: boolean;
  receivedAt: Date;
  isImportant: boolean;
}

interface FeedbackListProps {
  feedback: Feedback[];
  projectId: string;
}

export default function FeedbackList({ feedback, projectId }: FeedbackListProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [updatingImportance, setUpdatingImportance] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  const handleGenerateSamples = async () => {
    try {
      setIsGenerating(true);
      await createSampleFeedback(projectId);
      router.refresh();
    } catch (error) {
      console.error('Error generating sample feedback:', error);
      alert('Failed to generate sample feedback');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleImportance = async (feedbackId: string) => {
    try {
      setUpdatingImportance(feedbackId);
      await toggleFeedbackImportance(feedbackId);
      router.refresh();
    } catch (error) {
      console.error('Error updating feedback:', error);
      alert('Failed to update feedback');
    } finally {
      setUpdatingImportance(null);
    }
  };

  const handleDelete = async (feedbackId: string) => {
    try {
      setIsDeleting(feedbackId);
      await deleteFeedback(feedbackId);
      setShowDeleteConfirm(null);
      router.refresh();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddFeedback = async (data: {
    subject: string;
    content: string;
    sender: string;
  }) => {
    await createFeedback({
      ...data,
      projectId
    });
    router.refresh();
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Feedback</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Feedback
            </button>
            <button
              onClick={handleGenerateSamples}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Sample Feedback'}
            </button>
          </div>
        </div>
      </div>

      {feedback.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {feedback.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start">
                    <button
                      onClick={() => handleToggleImportance(item.id)}
                      disabled={updatingImportance === item.id}
                      className={`mr-2 text-gray-400 hover:text-yellow-400 ${
                        item.isImportant ? 'text-yellow-400' : ''
                      }`}
                    >
                      {item.isImportant ? (
                        <StarIconSolid className="h-5 w-5" />
                      ) : (
                        <StarIcon className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{item.subject}</h3>
                      <p className="mt-1 text-sm text-gray-600">{item.content}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {item.isUserWritten ? (
                      <span className="text-indigo-600">Added by user</span>
                    ) : (
                      <>From: {item.sender}</>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-4">
                  <span className="text-xs text-gray-500">
                    {new Date(item.receivedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setShowDeleteConfirm(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No feedback yet. Generate some sample feedback to see how it looks.
        </div>
      )}

      {showAddForm && (
        <AddFeedbackForm
          projectId={projectId}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddFeedback}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Feedback</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this feedback? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={isDeleting === showDeleteConfirm}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeleting === showDeleteConfirm ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 