import UserSettingsForm from '@/app/components/UserSettingsForm';

export default function UserSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      <UserSettingsForm />
    </div>
  );
} 