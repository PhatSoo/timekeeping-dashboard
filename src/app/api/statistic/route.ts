import { fetchWithAuth } from '../config';

// Get all shifts
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  const data = await fetchWithAuth(`${process.env.API_SERVER}/api/statistic/${date}`).then(async (res) => await res.json());

  return Response.json(data);
};
