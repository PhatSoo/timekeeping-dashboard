import { fetchWithAuth } from '../config';

// Get all shifts
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const filterType = searchParams.get('filterType');

  console.log('====================================');
  console.log(`${process.env.API_SERVER}/api/statistic/${from}/${to}/${filterType}`);
  console.log('====================================');

  const data = await fetchWithAuth(`${process.env.API_SERVER}/api/statistic/${from}/${to}/${filterType}`).then(async (res) => await res.json());

  return Response.json(data);
};
