'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Project } from '../types/project';
import { Roadmap, RoadmapPhase } from '../types/roadmap';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateRoadmapWithAI(project: Project): Promise<RoadmapPhase[]> {
  // First get the user's preferred model
  const user = await prisma.user.findUnique({
    where: { id: project.userId || '' }
  });

  const prompt = `
    Create a detailed project roadmap for the following project:
    
    Project Name: ${project.name}
    Description: ${project.description}
    Constraints: ${project.constraints}
    Code Guidelines: ${project.codeGuidelines}
    Product Brief: ${project.productBrief}
    Tech Stack: ${JSON.stringify(project.techStack, null, 2)}
    Target Audience: ${project.targetAudience}
    Key Features: ${project.keyFeatures}
    Success Metrics: ${project.successMetrics}
    Timeline: ${project.timeline}
    Budget: ${project.budget}
    Team Size: ${project.teamSize}
    Development Methodology: ${project.methodology}
    Integration Requirements: ${project.integrationRequirements}
    Security Requirements: ${project.securityRequirements}
    Performance Requirements: ${project.performanceRequirements}
    Accessibility Requirements: ${project.accessibilityRequirements}
    Testing Requirements: ${project.testingRequirements}
    Deployment Strategy: ${project.deploymentStrategy}
    Maintenance Plan: ${project.maintenancePlan}
    
    Create a structured roadmap with phases and tasks. Each phase should include:
    - A clear title and description that aligns with the project requirements
    - A list of specific tasks with estimated hours
    - Dependencies on other phases (if any)
    - Estimated duration considering the team size and timeline constraints
    
    The first Phase is an AI Prototyping phase, which is focused on creating a POC in a day using AI code generators.
    
    Consider:
    - Technical dependencies and setup requirements
    - Integration points with external systems
    - Security implementation stages
    - Testing phases and quality assurance
    - Performance optimization points
    - Accessibility implementation
    - Deployment preparation and execution
    - Documentation requirements
    
    Respond with a JSON array where each item represents a phase. The response should look exactly like this:
    [
      {
        "title": "Phase 1 Title",
        "description": "Phase description",
        "estimatedDuration": "2 weeks",
        "dependencies": [],
        "tasks": [
          {
            "title": "Task 1",
            "description": "Task description",
            "priority": "high",
            "estimatedHours": 8
          }
        ]
      }
    ]
  `;

  const completion = await openai.chat.completions.create({
    model: user?.preferredModel || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a senior project manager and technical architect specializing in web development projects. 
        Consider all project requirements, constraints, and technical aspects when creating the roadmap.
        Ensure tasks are properly sized for the team and timeline.
        Always respond with valid JSON only.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('Failed to generate roadmap: No content received from OpenAI');
  }

  try {
    // Clean the response content - extract JSON if wrapped in code blocks
    const cleanContent = content.replace(/```json\n|\n```|```/g, '').trim();
    console.log('Cleaned content:', cleanContent);

    const response = JSON.parse(cleanContent);
    
    // Log the response to debug
    console.log('OpenAI Response:', response);

    // Check if response has the expected structure
    if (!response) {
      throw new Error('Empty response from OpenAI');
    }

    // Convert response to array if it's not already
    const phasesArray = Array.isArray(response) ? response : 
                       response.phases && Array.isArray(response.phases) ? response.phases : 
                       null;
    
    if (!phasesArray) {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid response structure from OpenAI');
    }

    // Type guard to ensure phase structure
    const isValidPhase = (phase: any): phase is RoadmapPhase => {
      return typeof phase === 'object' && 
             phase !== null &&
             typeof phase.title === 'string' &&
             typeof phase.description === 'string' &&
             typeof phase.estimatedDuration === 'string' &&
             Array.isArray(phase.dependencies) &&
             Array.isArray(phase.tasks) &&
             phase.tasks.every((task: any) => 
               typeof task === 'object' &&
               task !== null &&
               typeof task.title === 'string' &&
               typeof task.description === 'string' &&
               typeof task.priority === 'string' &&
               typeof task.estimatedHours === 'number'
             );
    };

    // Add IDs and status to phases and tasks
    return phasesArray.map((phase: any) => {
      if (!isValidPhase(phase)) {
        console.error('Invalid phase structure:', phase);
        throw new Error('Invalid phase structure in response');
      }

      return {
        ...phase,
        id: crypto.randomUUID(),
        status: 'pending',
        tasks: phase.tasks.map(task => ({
          ...task,
          id: crypto.randomUUID(),
          status: 'pending'
        }))
      } satisfies RoadmapPhase;
    });
  } catch (error) {
    console.error('Failed to parse OpenAI response:', error);
    console.error('Raw content:', content);
    throw new Error('Failed to generate valid roadmap structure: ' + (error as Error).message);
  }
}

export async function createRoadmap(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const projectData: Project = {
      ...project,
      techStack: JSON.parse(project.techStack)
    };

    const phases = await generateRoadmapWithAI(projectData);

    // Create roadmap and phases in a transaction
    const roadmap = await prisma.$transaction(async (tx) => {
      // Create the roadmap
      const newRoadmap = await tx.roadmap.create({
        data: {
          projectId,
          phases: JSON.stringify(phases)
        }
      });

      // Create Phase records for each phase in the roadmap
      for (const phase of phases) {
        await tx.phase.create({
          data: {
            id: phase.id,
            roadmapId: newRoadmap.id
          }
        });
      }

      return newRoadmap;
    });

    revalidatePath('/planning');
    return { success: true, roadmap };
  } catch (error) {
    console.error('Failed to create roadmap:', error);
    throw new Error('Failed to create roadmap');
  }
}

export async function getRoadmap(projectId: string): Promise<Roadmap | null> {
  const roadmap = await prisma.roadmap.findFirst({
    where: { projectId },
    orderBy: { createdAt: 'desc' }
  });

  if (!roadmap) return null;

  return {
    ...roadmap,
    phases: JSON.parse(roadmap.phases)
  };
}

export async function regenerateRoadmap(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const projectData: Project = {
      ...project,
      techStack: JSON.parse(project.techStack)
    };

    const newPhases = await generateRoadmapWithAI(projectData);

    const existingRoadmap = await prisma.roadmap.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });

    // Update or create roadmap and phases in a transaction
    const roadmap = await prisma.$transaction(async (tx) => {
      if (existingRoadmap) {
        // Delete existing phases
        await tx.phase.deleteMany({
          where: { roadmapId: existingRoadmap.id }
        });

        // Update roadmap
        const updatedRoadmap = await tx.roadmap.update({
          where: { id: existingRoadmap.id },
          data: {
            phases: JSON.stringify(newPhases),
            updatedAt: new Date()
          }
        });

        // Create new phases
        for (const phase of newPhases) {
          await tx.phase.create({
            data: {
              id: phase.id,
              roadmapId: updatedRoadmap.id
            }
          });
        }

        return updatedRoadmap;
      } else {
        // Create new roadmap
        const newRoadmap = await tx.roadmap.create({
          data: {
            projectId,
            phases: JSON.stringify(newPhases)
          }
        });

        // Create phases
        for (const phase of newPhases) {
          await tx.phase.create({
            data: {
              id: phase.id,
              roadmapId: newRoadmap.id
            }
          });
        }

        return newRoadmap;
      }
    });

    revalidatePath('/planning');
    return { success: true, roadmap };
  } catch (error) {
    console.error('Failed to regenerate roadmap:', error);
    throw new Error('Failed to regenerate roadmap');
  }
} 