// Get all attendance of part-time by date
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  const data = await fetch(`${process.env.API_SERVER}/api/shift-attendance/date/${date}`, { cache: 'no-store' }).then((res) => res.json());
  return Response.json(data);
};
