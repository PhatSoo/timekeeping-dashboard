// Get all roles
export const GET = async () => {
  const data = await fetch(`${process.env.API_SERVER}/api/role`, { cache: 'no-store' }).then((res) => res.json());
  return Response.json(data);
};

export const POST = async (req: Request) => {
  const typeName = await req.json();

  return fetch(`${process.env.API_SERVER}/api/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(typeName),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const PUT = async (req: Request) => {
  const data = await req.json();

  return fetch(`${process.env.API_SERVER}/api/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const DELETE = async (req: Request) => {
  const id = await req.json();

  return fetch(`${process.env.API_SERVER}/api/role`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(id),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};
