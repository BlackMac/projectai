'use client';

import Link from 'next/link';
import Image from 'next/image';

interface UserSectionProps {
  user: {
    name: string | null;
    email: string;
    avatar?: string | null;
  };
}

export function UserSection({ user }: UserSectionProps) {
  return (
    <div className="flex items-center px-2 py-2">
      <div className="flex-shrink-0">
        {user.avatar ? (
          <Image
            className="h-8 w-8 rounded-lg"
            src={user.avatar}
            alt=""
            width={32}
            height={32}
          />
        ) : (
          <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user.name?.[0] || user.email[0].toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="ml-3 flex items-center">
        <p className="text-sm font-medium text-gray-700">{user.name || user.email}</p>
        <Link
          href="/settings"
          className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/80 transition-colors"
          title="Settings"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </div>
  );
} 