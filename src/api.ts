import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const TOKEN_KEY = 'six-cities-token';

/**
 * Создаёт и возвращает настроенный экземпляр axios
 * @returns Настроенный экземпляр axios с baseURL и timeout
 */
export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: 'https://14.design.htmlacademy.pro/six-cities',
    timeout: 5000,
  });

  // Interceptor для добавления токена в заголовки
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers['X-Token'] = token;
      }
      return config;
    }
  );

  // Interceptor для обработки 401
  api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const dropToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

