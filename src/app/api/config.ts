'use server';
import { cookies } from 'next/headers';

// Tạo một hàm fetch wrapper
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let token: string = '';
  const cookie = cookies().get('token');
  if (cookie) {
    const tokenValue = cookie.value;
    if (tokenValue !== undefined) {
      token = tokenValue.toString();
    }
  }

  // Thêm header authorization vào options
  options.headers = {
    ...options.headers,
    Authorization: token,
    'Content-Type': 'application/json',
  };

  // Gọi fetch với url và options đã được cập nhật
  const response = await fetch(url, options);

  // Trả về response
  return response;
};
