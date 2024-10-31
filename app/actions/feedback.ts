'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const sampleSubjects = [
  "Feature Request: Dark Mode",
  "Bug Report: Mobile Layout",
  "Suggestion for Navigation",
  "Performance Issue",
  "Accessibility Feedback",
  "UX Improvement Ideas",
  "Integration Question",
  "Mobile App Request",
  "Dashboard Enhancement",
  "Search Functionality"
];

const sampleSenders = [
  "john.doe@company.com",
  "sarah.smith@startup.io",
  "tech.lead@enterprise.com",
  "ux.designer@agency.net",
  "product.owner@client.org"
];

const sampleContent = [
  "Would love to see a dark mode option for better night-time usage.",
  "The mobile layout breaks when viewing on iPhone 13. Steps to reproduce...",
  "Consider adding keyboard shortcuts for power users.",
  "Dashboard takes too long to load with large datasets.",
  "Color contrast needs improvement for better accessibility.",
  "The navigation could be more intuitive if reorganized.",
  "Having trouble integrating with our existing tools.",
  "A mobile app would greatly improve our workflow.",
  "Could we add more customization options to the dashboard?",
  "Search results could be more relevant with filters."
];

export async function createSampleFeedback(projectId: string) {
  try {
    const feedbackItems = Array.from({ length: 5 }, () => ({
      subject: sampleSubjects[Math.floor(Math.random() * sampleSubjects.length)],
      content: sampleContent[Math.floor(Math.random() * sampleContent.length)],
      sender: sampleSenders[Math.floor(Math.random() * sampleSenders.length)],
      isImportant: Math.random() > 0.7, // 30% chance of being important
      projectId
    }));

    await prisma.feedback.createMany({
      data: feedbackItems
    });

    revalidatePath('/feedback');
    return { success: true };
  } catch (error) {
    console.error('Failed to create sample feedback:', error);
    throw new Error('Failed to create sample feedback');
  }
}

export async function getFeedback(projectId: string | null) {
  if (!projectId) return [];
  
  return prisma.feedback.findMany({
    where: { projectId },
    orderBy: [
      { isImportant: 'desc' },
      { receivedAt: 'desc' }
    ]
  });
}

export async function toggleFeedbackImportance(feedbackId: string) {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    if (!feedback) throw new Error('Feedback not found');

    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: { isImportant: !feedback.isImportant }
    });

    revalidatePath('/feedback');
    return { success: true, isImportant: updatedFeedback.isImportant };
  } catch (error) {
    console.error('Failed to toggle feedback importance:', error);
    throw new Error('Failed to update feedback');
  }
}

export async function deleteFeedback(feedbackId: string) {
  try {
    await prisma.feedback.delete({
      where: { id: feedbackId }
    });

    revalidatePath('/feedback');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete feedback:', error);
    throw new Error('Failed to delete feedback');
  }
}

export async function createFeedback(data: {
  subject: string;
  content: string;
  projectId: string;
}) {
  try {
    await prisma.feedback.create({
      data: {
        ...data,
        isUserWritten: true,
        isImportant: false
      }
    });

    revalidatePath('/feedback');
    return { success: true };
  } catch (error) {
    console.error('Failed to create feedback:', error);
    throw new Error('Failed to create feedback');
  }
}