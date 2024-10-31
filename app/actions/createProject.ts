'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function createProject(data: {
  name: string;
  description: string;
  constraints: string;
  codeGuidelines: string;
  productBrief: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    const project = await prisma.project.create({
      data: {
        ...data,
        userId: session.user.id,  // Associate project with user
        techStack: JSON.stringify([]), // Empty array for now
        targetAudience: '',
        keyFeatures: '',
        successMetrics: '',
        timeline: '',
        budget: '',
        teamSize: '',
        methodology: '',
        integrationRequirements: '',
        securityRequirements: '',
        performanceRequirements: '',
        accessibilityRequirements: '',
        testingRequirements: '',
        deploymentStrategy: '',
        maintenancePlan: '',
        feedbackEmail: `project-${Date.now()}@example.com`,
      }
    });

    // Set this as the current project
    await prisma.appState.upsert({
      where: { id: `current-${session.user.id}` },
      create: {
        id: `current-${session.user.id}`,
        currentProjectId: project.id,
      },
      update: {
        currentProjectId: project.id,
      },
    });

    revalidatePath('/');
    revalidatePath('/settings');
    
    return { success: true, project };
  } catch (error) {
    console.error('Failed to create project:', error);
    throw new Error('Failed to create project');
  }
} 