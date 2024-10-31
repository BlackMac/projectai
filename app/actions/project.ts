'use server'

import { prisma } from '@/lib/db';
import { Project } from '../types/project';
import { revalidatePath } from 'next/cache';
import { words } from '@/lib/words';
import { getServerAuthSession } from '@/lib/auth';
import { withAuth } from '@/lib/auth-utils';

export async function getCurrentProject(): Promise<Project | null> {
  return withAuth(async (userId) => {
    const appState = await prisma.appState.findUnique({
      where: { 
        id: `current-${userId}`
      }
    });

    if (!appState?.currentProjectId) {
      return null;
    }

    const project = await prisma.project.findFirst({
      where: { 
        id: appState.currentProjectId,
        userId: userId
      }
    });

    if (!project) {
      return null;
    }

    return {
      ...project,
      techStack: JSON.parse(project.techStack)
    };
  });
}

export async function getProjects(): Promise<Project[]> {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) return [];

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id  // Only return user's projects
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return projects.map(project => ({
      ...project,
      techStack: JSON.parse(project.techStack)
    }));
  } catch (error) {
    console.error('Failed to get projects:', error);
    return [];
  }
}

export async function setCurrentProject(projectId: string) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error('Unauthorized');

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    });

    if (!project) {
      throw new Error('Project not found or unauthorized');
    }

    await prisma.appState.upsert({
      where: { id: `current-${session.user.id}` },
      update: { currentProjectId: projectId },
      create: {
        id: `current-${session.user.id}`,
        currentProjectId: projectId
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to set current project:', error);
    throw new Error('Failed to set current project');
  }
}

export async function updateProject(projectId: string, data: Partial<Project>) {
  return withAuth(async (userId) => {
    // Verify ownership
    const project = await prisma.project.findFirst({
      where: { 
        id: projectId,
        userId 
      }
    });

    if (!project) {
      throw new Error('Project not found or unauthorized');
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...data,
        techStack: Array.isArray(data.techStack) ? JSON.stringify(data.techStack) : undefined,
      },
    });

    revalidatePath('/settings');
    return { success: true, project: updatedProject };
  });
}

export async function generateSampleProject(): Promise<Project> {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user?.id) {
      console.error('No authenticated session found');
      throw new Error('Please sign in to generate a sample project');
    }

    const date = new Date();
    const monthName = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate().toString().padStart(2, '0');
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const uniqueSuffix = `${randomWord}-${monthName}-${day}`;
    
    const sampleProject = await prisma.project.create({
      data: {
        name: `SoftVoice-${uniqueSuffix}`,
        description: "A modern Browser based Softphone",
        productBrief: "A browser based softphone that rethinks the category of softphones by removing old school concepts like dial pads and instead focusing on a minimalistic design that puts the user at the center.",
        techStack: JSON.stringify([
          "SIP.js",
          "wss://sip.sipgate.com",
          "Tailwind CSS"
        ]),
        codeGuidelines: "Follow TypeScript best practices, use functional components, implement proper error handling, store all data in the browser's local storage. Use SIP credentils to log in, use the browser's local storage to store the SIP credentials.",
        targetAudience: "Small to medium-sized businesses",
        keyFeatures: "Voice and Video calling, Contact management, Call logs, Voicemail",
        successMetrics: "User engagement, Call quality, Usability",
        timeline: "6 months",
        budget: "$150,000",
        teamSize: "5-7 developers",
        methodology: "Agile with 2-week sprints",
        integrationRequirements: "GitHub, Slack, project management tools",
        securityRequirements: "",
        performanceRequirements: "< 2s page load, 99.9% uptime",
        accessibilityRequirements: "WCAG 2.1 AA compliance",
        feedbackEmail: `project-${Date.now()}@example.com`,
        testingRequirements: "",
        deploymentStrategy: "",
        maintenancePlan: "",
        constraints: "",
        userId: session.user.id,
      }
    });

    // Updated AppState upsert
    await prisma.appState.upsert({
      where: { id: `current-${session.user.id}` },  // Make sure to use user-specific ID
      create: {
        id: `current-${session.user.id}`,
        currentProjectId: sampleProject.id,
        userId: session.user.id  // Include userId in create
      },
      update: {
        currentProjectId: sampleProject.id
      },
    });

    return {
      ...sampleProject,
      techStack: JSON.parse(sampleProject.techStack)
    };
  } catch (error) {
    console.error('Failed to generate sample project:', error);
    if (error instanceof Error) {
      throw error; // Preserve the original error message
    }
    throw new Error('Failed to generate sample project');
  }
}

export async function deleteProject(projectId: string) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) throw new Error('Unauthorized');

    // Verify project ownership before deletion
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    });

    if (!project) {
      throw new Error('Project not found or unauthorized');
    }

    // Delete the project
    await prisma.project.delete({
      where: { id: projectId }
    });

    // Reset the current project in AppState if it was the deleted project
    const appState = await prisma.appState.findUnique({
      where: { id: `current-${session.user.id}` }  // Make AppState user-specific
    });

    if (appState?.currentProjectId === projectId) {
      await prisma.appState.update({
        where: { id: `current-${session.user.id}` },
        data: { currentProjectId: null }
      });
    }

    revalidatePath('/');
    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw new Error('Failed to delete project');
  }
} 