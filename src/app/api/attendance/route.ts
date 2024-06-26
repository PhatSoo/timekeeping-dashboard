import { fetchWithAuth } from '../config';

// Get all attendance of full-time by date
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  const data = await fetchWithAuth(`${process.env.API_SERVER}/api/attendance/date/${date}`, { cache: 'no-store' }).then((r) => r.json());

  return Response.json(data);
};
