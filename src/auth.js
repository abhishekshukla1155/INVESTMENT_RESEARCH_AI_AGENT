/**
 * @file auth.js
 * @description NextAuth v5 configuration for INVESTOR AI.
 * Supports Google OAuth and credentials sign-in.
 *
 * SETUP REQUIRED — add these to .env.local:
 *   AUTH_SECRET=<run: npx auth secret>
 *   AUTH_GOOGLE_ID=<from Google Cloud Console>
 *   AUTH_GOOGLE_SECRET=<from Google Cloud Console>
 */

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Google OAuth — requires AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET in .env.local
    Google,

    // Email/Password credentials — demo only (no database required for the project)
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // NOTE: In production you would validate against a real database.
        // For this portfolio project, we accept any non-empty credentials as a demo.
        if (credentials?.email && credentials?.password) {
          return {
            id: '1',
            name: credentials.email.split('@')[0],
            email: credentials.email
          };
        }
        return null;
      }
    })
  ],

  pages: {
    signIn: '/login',
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Allow public access to the main page — only protect future authenticated routes
      return true;
    }
  }
});
