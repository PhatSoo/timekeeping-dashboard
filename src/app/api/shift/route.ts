// Get all shifts
export const GET = async () => {
  const data = await fetch(`${process.env.API_SERVER}/api/work-shift`, { cache: 'no-store' }).then(async (res) => await res.json());
  return Response.json(data);
};
