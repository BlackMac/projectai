import { getCurrentProject, setCurrentProject, getProjects } from '../actions/project';
import { getRoadmap } from '../actions/roadmap';
import RoadmapView from '../components/RoadmapView';

export default async function Planning() {
  const project = await getCurrentProject();
  const roadmap = project ? await getRoadmap(project.id) : null;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Project Planning</h1>
      
      {project ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{project.name} - Planning</h2>
            </div>
            <p className="text-gray-600 mb-6">Plan and organize your project development phases.</p>
            
            <RoadmapView projectId={project.id} initialRoadmap={roadmap} />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">No project loaded. Create a new project or use a template to get started.</p>
        </div>
      )}
    </div>
  );
} 