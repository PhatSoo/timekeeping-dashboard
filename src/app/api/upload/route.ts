import { cookies } from 'next/headers';

// Create a new employee
export const POST = async (req: Request) => {
  let data = await req.formData();
  const { searchParams } = new URL(req.url);

  if (searchParams.has('checkImage')) {
    // Kiểm tra chất lượng ảnh

    return fetch(`${process.env.API_SERVER}/api/upload/check-avatar`, {
      method: 'POST',
      headers: { Authorization: getCookiesToken() },
      body: data,
    })
      .then((response) => response.json())
      .then((result) => Response.json(result));
  } else {
    // Thêm ảnh

    return fetch(`${process.env.API_SERVER}/api/upload/avatar`, {
      method: 'POST',
      headers: { Authorization: getCookiesToken() },
      body: data,
    })
      .then((response) => response.json())
      .then((result) => Response.json(result));
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
