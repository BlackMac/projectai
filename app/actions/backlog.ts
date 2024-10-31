'use server'

import { prisma } from '@/lib/db';
import OpenAI from 'openai';
import { RoadmapPhase } from '../types/roadmap';
import { revalidatePath } from 'next/cache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBacklogForPhase(phaseId: string, phase: RoadmapPhase) {
  try {
    // First fetch the project to get the AI model
    const phaseWithProject = await prisma.phase.findUnique({
      where: { id: phaseId },
      include: {
        roadmap: {
          include: {
            project: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!phaseWithProject?.roadmap?.project) {
      throw new Error('Project not found');
    }

    const prompt = `
      You are a senior product owner and agile expert. Create detailed, actionable backlog items.
      Be aware that most of the backlog items will be performed by AI when possible, so try to avoid as much human work as possible.
      The human should only do work, if it is not possible to perform the work with AI.

      Create a detailed backlog for the following project phase:

      Phase Title: ${phase.title}
      Phase Description: ${phase.description}
      Estimated Duration: ${phase.estimatedDuration}
      Dependencies: ${phase.dependencies.join(', ')}
      Project Brief: ${phaseWithProject.roadmap.project.brief}

      Tasks:
      ${phase.tasks.map(task => `
        - ${task.title}
        - Description: ${task.description}
        - Priority: ${task.priority}
        - Estimated Hours: ${task.estimatedHours}
      `).join('\n')}

      Generate a list of detailed backlog items that need to be completed for this phase.
      For each item include:
      - Type (user story/task/bug/technical debt)
      - Title
      - Description
      - Acceptance Criteria
      - Story Points (1, 2, 3, 5, 8, 13)
      - Priority (high, medium, low)
      - Role (developer, designer, product manager, etc.)
      - humanPreparation: Try to avoid this whenever possible. The human should do no work! Zero items is best!A detailed List of steps that a human would need to take before the AI can implement this item. 
      - aiPrompt: A detailed prompt that instructs an AI on how to implement this item:
        Example AI Prompt:
          Create a comprehensive architecture design for an application that includes SIP.js integration. The architecture should detail the data flow, component interactions, and local storage strategy. Ensure to include the following elements:
            - Technical requirements: Specify all technologies to be used (e.g., SIP.js, local storage, etc.).
            - Code structure: Suggest a modular structure that separates concerns effectively.
            - Important considerations: Outline potential bottlenecks in data flow and integration.
            - Testing requirements: Identify unit tests and integration tests to validate architecture.
            - Edge cases: Consider scenarios where SIP.js may fail or local storage might be unavailable.
            - Performance: Recommend strategies for optimizing storage access and SIP communication.
            - Security: Address data encryption methods for storage and SIP communications.
            - Accessibility: Ensure that the architecture supports accessibility compliance.
            - Dependencies: List libraries, frameworks, and APIs needed for implementation.
            - Challenges: Discuss potential integration issues with SIP.js and local storage, along with solutions.
            - Best practices: Include best practices for architecture design and documentation requirements.

      For different types, focus the AI prompt on:
      - User Stories: End-to-end implementation including UI, backend, and data flow
      - Tasks: Specific technical implementation details and system changes
      - Bugs: Debugging approach, fix implementation, and regression prevention
      - Technical Debt: Refactoring strategy, migration plan, and risk mitigation

      Format the response as a JSON array:
      [
        {
          "type": "user story",
          "title": "Example Story",
          "description": "As a user...",
          "acceptanceCriteria": ["Criteria 1", "Criteria 2"],
          "storyPoints": 5,
          "priority": "high",
          "role": "developer",
          "humanPreparation": ["Step 1", "Step 2", "Step 3"],
          "aiPrompt": "Detailed instructions for AI implementation..."
        }
      ]
    `;

    console.log('Generating backlog for phase:', phaseId);

    const completion = await openai.chat.completions.create({
      model: phaseWithProject.roadmap.project.user?.preferredModel || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a senior product manager and agile expert. Create detailed, actionable backlog items."
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
      throw new Error('No content received from OpenAI');
    }

    console.log('Received OpenAI response');

    // Clean and parse the response
    const cleanContent = content.replace(/```json\n|\n```|```/g, '').trim();
    console.log('Cleaned content:', cleanContent);

    const backlogItems = JSON.parse(cleanContent);
    console.log('Parsed backlog items:', backlogItems);

    // Check if existing backlog exists
    const existingBacklog = await prisma.backlog.findFirst({
      where: { phaseId }
    });

    // Update or create backlog
    const result = existingBacklog
      ? await prisma.backlog.update({
          where: { id: existingBacklog.id },
          data: {
            items: JSON.stringify(backlogItems),
            updatedAt: new Date()
          }
        })
      : await prisma.backlog.create({
          data: {
            phaseId,
            items: JSON.stringify(backlogItems)
          }
        });

    console.log('Saved backlog to database');

    revalidatePath('/planning');
    return { success: true, backlog: result };
  } catch (error) {
    console.error('Failed to generate backlog:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate backlog: ${error.message}`);
    }
    throw new Error('Failed to generate backlog: Unknown error');
  }
}

export async function getBacklogForPhase(phaseId: string) {
  try {
    const backlog = await prisma.backlog.findFirst({
      where: { phaseId },
      orderBy: { createdAt: 'desc' }
    });

    if (!backlog) return null;

    return {
      ...backlog,
      items: JSON.parse(backlog.items)
    };
  } catch (error) {
    console.error('Error fetching backlog:', error);
    return null;
  }
} 