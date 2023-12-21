import { cookies } from 'next/headers';
import { fetchWithAuth } from '../config';

export const GET = async (req: Request) => {
  return fetchWithAuth(`${process.env.API_SERVER2}/api/upload-attendance`)
    .then((response) => response.json())
    .then((result) => Response.json(result));
};

// Create a new employee
export const POST = async (req: Request) => {
  let data = await req.formData();
  const { searchParams } = new URL(req.url);

  if (searchParams.has('checkImage')) {
    // Kiểm tra chất lượng ảnh

    return fetch(`${process.env.API_SERVER2}/api/upload/check-avatar`, {
      method: 'POST',
      headers: { Authorization: getCookiesToken() },
      body: data,
    })
      .then((response) => response.json())
      .then((result) => Response.json(result));
  } else {
    // Thêm ảnh

    const res = await fetch(`${process.env.API_SERVER}/api/upload/avatar`, {
      method: 'POST',
      headers: { Authorization: getCookiesToken() },
      body: data,
    }).then((response) => response.json());

    await fetchWithAuth(`${process.env.API_SERVER2}/api/face-descriptor`, {
      method: 'POST',
      body: JSON.stringify({ _id: data.get('_id') }),
    });

    return Response.json(res);
  }
};

const getCookiesToken = () => {
  let token: string = '';
  const cookie = cookies().get('token');
  if (cookie) {
    const tokenValue = cookie.value;
    if (tokenValue !== undefined) {
      token = tokenValue.toString();
    }
  }
  return token;
};
