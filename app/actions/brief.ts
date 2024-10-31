'use server'

import { prisma } from '@/lib/db';
import OpenAI from 'openai';
import { Project } from '../types/project';
import { Roadmap } from '../types/roadmap';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateProjectBrief(projectId: string) {
  try {
    // Fetch project with its roadmap
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: true,
        roadmaps: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        }
      }
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const projectData: Project = {
      ...project,
      techStack: JSON.parse(project.techStack)
    };

    const roadmap = project.roadmaps[0] ? {
      ...project.roadmaps[0],
      phases: JSON.parse(project.roadmaps[0].phases)
    } : null;

    const prompt = `
      Create a comprehensive project brief document in markdown format for the following project:

      Project Overview:
      - Name: ${project.name}
      - Description: ${project.description}
      - Product Brief: ${project.productBrief}
      
      Technical Details:
      - Tech Stack: ${JSON.stringify(project.techStack, null, 2)}
      - Code Guidelines: ${project.codeGuidelines}
      
      Project Parameters:
      - Target Audience: ${project.targetAudience}
      - Key Features: ${project.keyFeatures}
      - Success Metrics: ${project.successMetrics}
      - Timeline: ${project.timeline}
      - Budget: ${project.budget}
      - Team Size: ${project.teamSize}
      
      Requirements:
      - Integration Requirements: ${project.integrationRequirements}
      - Security Requirements: ${project.securityRequirements}
      - Performance Requirements: ${project.performanceRequirements}
      - Accessibility Requirements: ${project.accessibilityRequirements}
      - Testing Requirements: ${project.testingRequirements}
      
      Implementation:
      - Development Methodology: ${project.methodology}
      - Deployment Strategy: ${project.deploymentStrategy}
      - Maintenance Plan: ${project.maintenancePlan}
      - Constraints: ${project.constraints}

      Project Roadmap:
      ${roadmap ? JSON.stringify(roadmap.phases, null, 2) : 'Not yet generated'}

      Create a well-structured, professional project brief that includes:
      1. Executive Summary
      2. Project Overview
      3. Technical Architecture
      4. Project Scope and Deliverables
      5. Timeline and Milestones
      6. Technical Requirements
      7. Implementation Strategy
      8. Risk Assessment and Mitigation
      9. Success Criteria
      10. Project Team and Resources

      Format the document in clean, professional markdown with proper headings, bullet points, and sections.
      Make it easy to read and understand for both technical and non-technical stakeholders.
    `;

    const completion = await openai.chat.completions.create({
      model: project.user?.preferredModel || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a senior technical project manager who creates clear, professional project documentation."
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
      throw new Error('Failed to generate brief');
    }

    return content;
  } catch (error) {
    console.error('Failed to generate project brief:', error);
    throw new Error('Failed to generate project brief');
  }
} 