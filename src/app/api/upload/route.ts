// Create a new employee
export const POST = async (req: Request) => {
  let data = await req.formData();
  console.log(data);

  return fetch(`${process.env.API_SERVER}/api/upload/avatar`, {
    method: 'POST',
    body: data,
  })
    .then((response) => response.json())
    .then((result) => Response.json(result));
};
