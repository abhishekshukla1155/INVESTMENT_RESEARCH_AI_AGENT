/**
 * @file route.js (Auth API handler)
 * @description NextAuth v5 App Router API handler.
 * Handles all /api/auth/* requests (sign-in, sign-out, callback, session).
 */

import { handlers } from '../../../../auth';

export const { GET, POST } = handlers;
