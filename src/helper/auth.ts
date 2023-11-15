'use server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function isAuthenticated() {
  try {
    await verifyToken();
    return true;
  } catch {
    return false;
  }
}

async function verifyToken() {
  const token = (await cookies().get('authorization')?.value) ?? '';
  const decoded = await jwt.verify(token, process.env.JWT_SECRET!);
  return decoded;
}

export async function setToken(token: string) {
  try {
    await cookies().set('authorization', token);
    return true;
  } catch {
    return false;
  }
}
