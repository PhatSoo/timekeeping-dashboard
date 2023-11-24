// Get all employees
export const GET = async () => {
  const data = await fetch(`${process.env.API_SERVER}/api/employee`, { cache: 'no-store' }).then((res) => res.json());
  return Response.json(data);
};
