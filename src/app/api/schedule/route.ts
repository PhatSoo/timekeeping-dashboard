// Get all schedule
export const GET = async () => {
  const data = await fetch(`${process.env.API_SERVER}/api/shift-schedule`).then(async (res) => await res.json());
  return Response.json(data);
};

// Schedule
export const POST = async (req: Request) => {
  const data = await req.json();
  return fetch(`${process.env.API_SERVER}/api/shift-schedule/schedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log(response);

      return response.json();
    })
    .then((result) => Response.json(result));
};
