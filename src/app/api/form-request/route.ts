// Get all Form requests
export const GET = async () => {
  const data = await fetch(`${process.env.API_SERVER}/api/form-request`, { cache: 'no-store' }).then((res) => res.json());
  return Response.json(data);
};
