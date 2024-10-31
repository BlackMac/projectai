import { ProjectSettings } from '../components/ProjectSettings';
import { updateProject, getCurrentProject, deleteProject } from '../actions/project';

export default async function SettingsPage() {
  const project = await getCurrentProject();
  
  if (!project) {
    return <div>No project selected</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Project Settings</h1>
      <ProjectSettings 
        project={project} 
        onUpdate={async (data) => {
          'use server'
          await updateProject(project.id, data);
        }}
        onDelete={async () => {
          'use server'
          await deleteProject(project.id);
        }}
      />
    </div>
  );
} 