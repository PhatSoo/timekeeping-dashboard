import { fetchWithAuth } from '../config';

// Get all Form requests
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  if (searchParams.has('pending')) {
    return await fetchWithAuth(`${process.env.API_SERVER}/api/form-request/pending`)
      .then((response) => response.json())
      .then((result) => Response.json(result));
  } else {
    const data = await fetchWithAuth(`${process.env.API_SERVER}/api/form-request`, { cache: 'no-store' }).then((res) => res.json());
    return Response.json(data);
  }
};

export const PUT = async (req: Request) => {
  const data = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/form-request`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};
