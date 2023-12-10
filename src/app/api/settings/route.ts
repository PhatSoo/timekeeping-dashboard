import { fetchWithAuth } from '../config';

// Get all shifts
export const GET = async (req: Request) => {
  const data = await fetchWithAuth(`${process.env.API_SERVER}/api/settings`).then(async (res) => await res.json());

  return Response.json(data);
};

export const POST = async (req: Request) => {
  const data = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/settings`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};
