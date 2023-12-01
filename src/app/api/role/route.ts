import { fetchWithAuth } from '../config';

// Get all roles
export const GET = async () => {
  const data = await fetchWithAuth(`${process.env.API_SERVER}/api/role`, { cache: 'no-store' }).then((res) => res.json());
  return Response.json(data);
};

export const POST = async (req: Request) => {
  const typeName = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/role`, {
    method: 'POST',
    body: JSON.stringify(typeName),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const PUT = async (req: Request) => {
  const data = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/role`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const DELETE = async (req: Request) => {
  const id = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/role`, {
    method: 'DELETE',
    body: JSON.stringify(id),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};
