'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getServerAuthSession } from '@/lib/auth';

export async function updateUserSettings(formData: FormData) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user?.id) {
      throw new Error('Not authenticated');
    }

    const name = formData.get('name') as string;
    const preferredModel = formData.get('preferredModel') as string;
    const avatar = formData.get('avatar') as File;

    let avatarUrl = undefined;
    if (avatar) {
      // Here you would typically upload the avatar to a storage service
      // and get back a URL. For now, we'll skip this part.
      // avatarUrl = await uploadAvatar(avatar);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        preferredModel,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        preferredModel: true,
      },
    });

    revalidatePath('/');
    revalidatePath('/settings');
    revalidatePath('/userSettings');
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw new Error('Failed to update settings');
  }
} 