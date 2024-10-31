import NewProjectForm from '../components/NewProjectForm';

export default function Create() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <NewProjectForm />
      </div>
    </div>
  );
} 