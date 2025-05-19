import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('token', token);

    return user;
  } catch (error: any) {
    let message = '';
    const zodError = error.response?.data?.errors;

    if (zodError) {
      const firstKey = Object.keys(zodError)[0];
      const firstMessage = zodError[firstKey][0];
      message = firstMessage;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    throw new Error(message);
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    return response.data.user;
  } catch (error: any) {
    let message = '';
    const zodError = error.response?.data?.errors;

    if (zodError) {
      const firstKey = Object.keys(zodError)[0];
      const firstMessage = zodError[firstKey][0];
      message = firstMessage;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }
    throw new Error(message);
  }
}

export function logout() {
  localStorage.removeItem('token');
}
