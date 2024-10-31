'use client';

import { useState, useCallback } from 'react';
import { createRoadmap, getRoadmap } from '../actions/roadmap';
import { useRouter } from 'next/navigation';
import { Roadmap, RoadmapPhase, RoadmapTask } from '../types/roadmap';
import { RegenerateButton } from "./RegenerateButton";
import { GenerateBacklogButton } from './GenerateBacklogButton';
import { BacklogButton } from './BacklogButton';
import { addDays, format, differenceInDays } from 'date-fns';

interface RoadmapViewProps {
  projectId: string;
  initialRoadmap: Roadmap | null;
}

export default function RoadmapView({ projectId, initialRoadmap }: RoadmapViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(initialRoadmap);
  const router = useRouter();
  const [backlogRefreshCounter, setBacklogRefreshCounter] = useState(0);
  const [viewType, setViewType] = useState<'list' | 'gantt'>('list');

  const handleGenerateRoadmap = async () => {
    try {
      setIsGenerating(true);
      const result = await createRoadmap(projectId);
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateComplete = useCallback(async () => {
    try {
      const updatedRoadmap = await getRoadmap(projectId);
      setRoadmap(updatedRoadmap);
    } catch (error) {
      console.error('Error fetching updated roadmap:', error);
    }
  }, [projectId]);

  const handleBacklogGenerated = useCallback(() => {
    setBacklogRefreshCounter(prev => prev + 1);
  }, []);

  const renderTask = (task: RoadmapTask) => (
    <div key={task.id} className="ml-8 mb-4 last:mb-0">
      <div className="flex items-start">
        <div className={`w-2 h-2 mt-2 mr-2 rounded-full ${
          task.priority === 'high' ? 'bg-red-400' :
          task.priority === 'medium' ? 'bg-yellow-400' :
          'bg-green-400'
        }`} />
        <div>
          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
          <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          <p className="mt-1 text-xs text-gray-500">
            Estimated time: {task.estimatedHours} hours
          </p>
        </div>
      </div>
    </div>
  );

  const renderPhase = (phase: RoadmapPhase) => (
    <div key={phase.id} className="mb-8 last:mb-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium text-sm">
            {phase.title.charAt(0)}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{phase.title}</h3>
            <p className="text-sm text-gray-600">{phase.description}</p>
          </div>
        </div>
        <BacklogButton phase={phase} onBacklogGenerated={handleBacklogGenerated} />
      </div>
      <div className="ml-4 border-l-2 border-gray-200 pl-4">
        {phase.tasks.map(renderTask)}
      </div>
    </div>
  );

  const renderGanttChart = (phases: RoadmapPhase[]) => {
    const startDate = new Date();
    const phaseColors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-yellow-100 text-yellow-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800',
      'bg-indigo-100 text-indigo-800',
    ];

    const phases_with_days = phases.map(phase => {
      const totalHours = phase.tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
      return {
        ...phase,
        days: Math.ceil(totalHours / 8)
      };
    });
    
    const totalDays = phases_with_days.reduce((sum, phase) => sum + phase.days, 0);
    const dayWidth = 20;

    return (
      <div className="overflow-x-auto">
        <div className="space-y-4">
          {phases_with_days.map((phase, index) => {
            const previousDays = phases_with_days
              .slice(0, index)
              .reduce((sum, p) => sum + p.days, 0);
            const colorClasses = phaseColors[index % phaseColors.length];
            const bgColorClass = colorClasses.split(' ')[0];
            
            return (
              <div key={phase.id} className="flex items-center mb-2">
                <div className="flex-1 relative h-8">
                  <div
                    className={`absolute h-full rounded ${colorClasses} group cursor-default`}
                    style={{
                      left: `${previousDays * dayWidth}px`,
                      width: `${phase.days * dayWidth}px`
                    }}
                  >
                    <div className="px-2 py-1.5 text-xs truncate h-full flex items-center">
                      {phase.title}
                      <span className={`absolute left-0 inset-y-0 flex items-center px-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity ${bgColorClass}`}>
                        {phase.title}
                        <a
                          href={`/planning/backlog/${phase.id}`}
                          className="ml-2 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v11.75A2.75 2.75 0 0016.75 18h-12A2.75 2.75 0 012 15.25V3.5zm3.75 7a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM5 5.75A.75.75 0 015.75 5h4.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75h-4.5A.75.75 0 015 8.25v-2.5z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Project Roadmap</h2>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewType === 'list'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => setViewType('list')}
            >
              List
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewType === 'gantt'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => setViewType('gantt')}
            >
              Gantt
            </button>
          </div>
        </div>
        <RegenerateButton 
          projectId={projectId} 
          isRegenerate={roadmap !== null}
          onRegenerateComplete={handleRegenerateComplete}
        />
      </div>
      
      {roadmap ? (
        <div className="space-y-6">
          {viewType === 'list' ? (
            roadmap.phases.map(renderPhase)
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              {renderGanttChart(roadmap.phases)}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
} 