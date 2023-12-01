import { fetchWithAuth } from '../config';

// Get all schedule
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  const data = await fetchWithAuth(`${process.env.API_SERVER}/api/shift-schedule/date/${date}`).then(async (res) => await res.json());
  return Response.json(data);
};

// Schedule
export const POST = async (req: Request) => {
  const data = await req.json();
  return fetchWithAuth(`${process.env.API_SERVER}/api/shift-schedule/schedule`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};
