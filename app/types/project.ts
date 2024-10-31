import { Project as PrismaProject } from '@prisma/client';

export interface Project extends Omit<PrismaProject, 'techStack'> {
  techStack: string[];
} 