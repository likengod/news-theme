import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { query } from '@/lib/db.server'

/**
 * Pure MySQL Session Authentication Middleware
 * Validates session token in MySQL database.
 */
export const requireAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const request = getRequest();

    if (!request?.headers) {
      throw new Error('Unauthorized: No request headers available');
    }

    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      throw new Error('Unauthorized: No authorization header provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: Only Bearer tokens are supported');
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }

    // Query active session in MySQL database
    const sessions = await query(
      `SELECT s.*, u.email FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.expires_at > NOW()`,
      [token]
    );

    if (sessions.length === 0) {
      throw new Error('Unauthorized: Invalid token or session expired');
    }

    const session = sessions[0];
    const rolesRows = await query("SELECT role FROM user_roles WHERE user_id = ?", [session.user_id]);
    const roles = rolesRows.map((r: any) => r.role);

    return next({
      context: {
        userId: session.user_id,
        claims: {
          sub: session.user_id,
          email: session.email,
          roles,
        },
      },
    });
  },
);

// Alias for backward compatibility during transition
export const requireSupabaseAuth = requireAuth;
