import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  // Your existing auth options here
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
  },
  // ... other options
};
