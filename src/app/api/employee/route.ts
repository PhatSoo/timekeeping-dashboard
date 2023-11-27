// Get all employees
export const GET = async () => {
  const data = await fetch(`${process.env.API_SERVER}/api/employee`, { cache: 'no-store' }).then((res) => res.json());
  return Response.json(data);
};

// Create a new employee
export const POST = async (req: Request) => {
  let data = await req.json();
  data = { ...data, password: '123456789' };
  return fetch(`${process.env.API_SERVER}/api/employee`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const PUT = async (req: Request) => {
  const data = await req.json();

  return fetch(`${process.env.API_SERVER}/api/employee`, {
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
  const { data } = await req.json();

  if (data.length === 1) {
    // Delete 1 employee
    return fetch(`${process.env.API_SERVER}/api/employee/${data[0]}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => Response.json(result));
  } else {
    // Delete multiple
    return fetch(`${process.env.API_SERVER}/api/employee`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
      .then((response) => response.json())
      .then((result) => Response.json(result));
  }
};
