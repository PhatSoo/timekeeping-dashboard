// Get all attendance of full-time by date
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  const data = await fetch(`${process.env.API_SERVER}/api/attendance/date/${date}`, { cache: 'no-store' }).then((res) => res.json());
  return Response.json(data);
};
