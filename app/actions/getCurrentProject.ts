'use server'

import { prisma } from '@/lib/db';
import { Project } from '../types/project';

export async function getCurrentProject(): Promise<Project | null> {
  try {
    // Get the current project ID from AppState
    const appState = await prisma.appState.findUnique({
      where: { id: 'current' }
    });

    if (!appState?.currentProjectId) {
      return null;
    }

    // Fetch the project with that ID
    const project = await prisma.project.findUnique({
      where: { id: appState.currentProjectId }
    });

    if (!project) {
      return null;
    }

    // Convert the project data to match the Project interface
    return {
      ...project,
      techStack: JSON.parse(project.techStack)
    };
  } catch (error) {
    console.error('Failed to get current project:', error);
    return null;
  }
} 