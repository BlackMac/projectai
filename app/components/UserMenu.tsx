'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  if (!user) {
    return (
      <div className="relative mt-auto">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
          <div className="ml-3 text-left">
            <p className="text-sm font-medium text-gray-600">
              Guest User
            </p>
            <p className="text-xs text-gray-500">
              Click to sign in
            </p>
          </div>
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-100">
              <Link
                href="/auth/signin"
                className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative mt-auto">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <UserCircleIcon className="h-8 w-8 text-gray-400" />
        <div className="ml-3 text-left">
          <p className="text-sm font-medium text-gray-600">
            {user.name || 'User'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        </div>
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-100">
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Sign out
            </button>
            <Link
              href="/userSettings"
              className="block w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Settings
            </Link>
          </div>
        </>
      )}
    </div>
  );
} 