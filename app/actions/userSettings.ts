'use client';

import { useState, useEffect } from 'react';
import { updateUserSettings } from '../actions/settings';
import { getUser } from '@/lib/auth';

export default function UserSettings() {
  const [user, setUser] = useState({
    name: '',
    avatar: null,
    preferredModel: 'gpt-4o-mini',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUser();
      if (currentUser) {
        setUser({
          name: currentUser.name || '',
          avatar: currentUser.avatar || null,
          preferredModel: currentUser.preferredModel || 'gpt-4o-mini',
        });
        setAvatarPreview(currentUser.avatar || null);
      }
    };
    fetchUser();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUser((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('preferredModel', user.preferredModel);
      if (user.avatar) {
        formData.append('avatar', user.avatar);
      }

      await updateUserSettings(formData);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Avatar</label>
        <div className="mt-2 flex items-center space-x-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="object-cover" />
            ) : (
              <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          id="name"
          value={user.name}
          onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Preferred AI Model</label>
        <select
          id="model"
          value={user.preferredModel}
          onChange={(e) => setUser((prev) => ({ ...prev, preferredModel: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="gpt-4o">GPT-4 Optimized</option>
          <option value="gpt-4o-mini">GPT-4 Optimized Mini</option>
          <option value="o1-mini">O1 Mini</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
