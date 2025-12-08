import axios, { AxiosInstance } from 'axios';

/**
 * Создаёт и возвращает настроенный экземпляр axios
 * @returns Настроенный экземпляр axios с baseURL и timeout
 */
export const createAPI = (): AxiosInstance => {
  const api = axios.create({
    baseURL: 'https://14.design.htmlacademy.pro/six-cities',
    timeout: 5000,
  });

  return api;
};

