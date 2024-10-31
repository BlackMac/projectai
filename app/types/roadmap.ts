export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  estimatedDuration: string;
  dependencies: string[];
  status: 'pending' | 'in-progress' | 'completed';
  tasks: RoadmapTask[];
}

export interface Roadmap {
  id: string;
  projectId: string;
  phases: RoadmapPhase[];
  createdAt: Date;
  updatedAt: Date;
} 