import { fetchWithAuth } from '../config';

// Get all shifts
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  let data;

  if (!searchParams.has('current')) {
    data = await fetchWithAuth(`${process.env.API_SERVER}/api/work-shift`, { cache: 'no-store' }).then(async (res) => await res.json());
  } else {
    data = await fetchWithAuth(`${process.env.API_SERVER}/api/current-shift`, { cache: 'no-store' }).then(async (res) => await res.json());
  }

  return Response.json(data);
};

export const POST = async (req: Request) => {
  const data = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/work-shift`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const PUT = async (req: Request) => {
  const data = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/work-shift`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const DELETE = async (req: Request) => {
  const data = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/work-shift`, {
    method: 'DELETE',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};
