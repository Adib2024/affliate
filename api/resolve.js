import { handleResolve } from './_lib/resolve.js';

// GET /api/resolve?url=<link affiliate>
export function GET(request) {
  return handleResolve(request);
}
