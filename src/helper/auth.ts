'use server';

import { cookies } from 'next/headers';

export const checkAdmin = () => {
  return console.log(cookies().has('token'));
};
