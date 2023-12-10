import { fetchWithAuth } from '../config';

// Get all employees
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  let data;
  if (!searchParams.has('isPartTime')) {
    data = await fetchWithAuth(`${process.env.API_SERVER}/api/employee`, { cache: 'no-store' }).then((res) => res.json());
  } else {
    if (searchParams.get('isPartTime') === '0') {
      // Get FullTime employees
      data = await fetchWithAuth(`${process.env.API_SERVER}/api/employee/part-time/0`, { cache: 'no-store' }).then(async (res) => await res.json());
    } else {
      // Get PartTime employees
      data = await fetchWithAuth(`${process.env.API_SERVER}/api/employee/part-time/1`, { cache: 'no-store' }).then(async (res) => await res.json());
    }
  }

  return Response.json(data);
};

// Create a new employee
export const POST = async (req: Request) => {
  let data = await req.json();
  data = { ...data, password: '123456789' };

  return fetchWithAuth(`${process.env.API_SERVER}/api/employee`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const PUT = async (req: Request) => {
  const data = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/api/employee`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const PATCH = async (req: Request) => {
  const data = await req.json();
  return fetchWithAuth(`${process.env.API_SERVER}/api/employee`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

export const DELETE = async (req: Request) => {
  const { data } = await req.json();

  if (data.length === 1) {
    // Delete 1 employee
    return fetchWithAuth(`${process.env.API_SERVER}/api/employee/${data[0]}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((result) => Response.json(result));
  } else {
    // Delete multiple
    return fetchWithAuth(`${process.env.API_SERVER}/api/employee`, {
      method: 'DELETE',
      body: JSON.stringify({ data }),
    })
      .then((response) => response.json())
      .then((result) => Response.json(result));
  }
};
