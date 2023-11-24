// Get all schedule
export const GET = async () => {
  const data = await fetch(`${process.env.API_SERVER}/api/shift-schedule`).then(async (res) => await res.json());
  return Response.json(data);
};
