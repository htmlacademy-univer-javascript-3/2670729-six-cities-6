export interface User {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  favoriteCount: number;
  favorites: number[];
}

export const user: User = {
  userID: 1,
  firstName: 'Oliver',
  lastName: 'Conner',
  email: 'Oliver.conner@gmail.com',
  favoriteCount: 3,
  favorites: [2, 4, 5],
};
