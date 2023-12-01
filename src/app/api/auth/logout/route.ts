import { cookies } from 'next/headers';

export const GET = async () => {
  cookies().delete('token');
  return Response.json({ success: true });
};
