// Get all part-time employees
export const GET = async () => {
  const data = await fetch(`${process.env.API_SERVER}/api/employee/part-time/1`).then(async (res) => await res.json());
  return Response.json(data);
};
