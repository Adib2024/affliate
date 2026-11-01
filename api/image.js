import { handleImage } from './_lib/resolve.js';

// GET /api/image?url=<url gambar produk>
export function GET(request) {
  return handleImage(request);
}
