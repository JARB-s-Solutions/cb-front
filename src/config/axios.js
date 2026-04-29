import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://controlbarber-backend.vercel.app/api',
  withCredentials: true 
});