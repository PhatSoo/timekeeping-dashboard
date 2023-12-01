import { fetchWithAuth } from '../../config';

// Get all part-time employees
export const GET = async () => {
  const data = await fetchWithAuth(`${process.env.API_SERVER}/api/employee/part-time/0`, { cache: 'no-store' }).then(async (res) => await res.json());
  return Response.json(data);
};
