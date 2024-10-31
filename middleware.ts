import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;
      
      // Public paths
      if (path === '/' || path.startsWith('/auth')) {
        return true;
      }
      
      // Protected paths require authentication
      return !!token;
    }
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 