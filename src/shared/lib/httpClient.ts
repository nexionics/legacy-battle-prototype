import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:3000';

export const authHttp = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
  validateStatus: () => true,
});
