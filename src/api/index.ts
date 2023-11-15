import { setToken } from '@/helper/auth';
import apiManager from './config';

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = (await apiManager.post('login', data)).data;

    if (res.success) {
      // store token into header
      apiManager.defaults.headers.common.Authorization = res.token;

      // store token into cookies
      setToken(res.token);
    }

    return res;
  } catch (error) {
    console.log(error);
  }
};
