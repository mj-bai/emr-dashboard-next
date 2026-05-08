import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'doctor@clinic.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Hardcoded demo login
        if (credentials.email === 'demo@clinic.com' && credentials.password === 'password') {
          return { id: '1', name: 'Dr. Sarah Chen', email: 'demo@clinic.com' };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      
      if (!isLoggedIn && !isOnLogin) {
        return Response.redirect(new URL('/login', nextUrl));
      }
      if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL('/', nextUrl));
      }
      return true;
    },
  },
});
