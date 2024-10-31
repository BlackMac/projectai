import { getCurrentProject } from '../actions/project';
import { getFeedback } from '../actions/feedback';
import FeedbackList from '../components/FeedbackList';
import CopyButton from '../components/CopyButton';

export default async function Feedback() {
  const project = await getCurrentProject();
  const feedback = await getFeedback(project?.id ?? null);

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Customer Feedback</h1>
      
      {project ? (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Feedback Email</h2>
            <p className="text-sm text-gray-600 mb-3">
              Customers can send feedback to this email address:
            </p>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <code className="text-indigo-600 font-mono">
                {project.feedbackEmail}
              </code>
              <CopyButton text={project.feedbackEmail} />
            </div>
          </div>

          <FeedbackList 
            feedback={feedback} 
            projectId={project.id}
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">
            No project selected. Please select a project to view its feedback.
          </p>
        </div>
      )}
    </div>
  );
} 