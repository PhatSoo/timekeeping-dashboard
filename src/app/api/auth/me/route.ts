import { fetchWithAuth } from '../../config';

export const GET = async () => {
  return fetchWithAuth(`${process.env.API_SERVER}/me/`)
    .then((response) => response.json())
    .then((result) => Response.json(result));
};
