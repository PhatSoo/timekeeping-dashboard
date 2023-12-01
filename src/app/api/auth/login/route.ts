import { cookies } from 'next/headers';
import { fetchWithAuth } from '../../config';
import { jwtDecode } from 'jwt-decode';

export const POST = async (req: Request) => {
  const data = await req.json();

  return fetchWithAuth(`${process.env.API_SERVER}/login`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        const oneHour = 60 * 60 * 1000;
        const decoded: { [key: string]: string } = jwtDecode(result.token);
        if (decoded.isAdmin) {
          cookies().set('token', result.token, { expires: Date.now() + oneHour });
        } else {
          return Response.json({ success: false, message: 'Bạn không phải là admin!!' });
        }
      }
      return Response.json(result);
    });
};
