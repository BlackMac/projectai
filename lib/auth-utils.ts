import { getServerAuthSession } from './auth';

export async function withAuth<T>(
  handler: (userId: string) => Promise<T>
): Promise<T> {
  const session = await getServerAuthSession();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  
  return handler(session.user.id);
} 