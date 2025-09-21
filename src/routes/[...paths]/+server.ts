import { api } from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request, platform }) => api.fetch(request, platform?.env, platform?.ctx);
export const POST: RequestHandler = ({ request, platform }) => api.fetch(request, platform?.env, platform?.ctx);