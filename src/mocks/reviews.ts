export interface Review {
  id: number;
  offerID: number;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
}

export const reviews: Review[] = [
  {
    id: 1,
    offerID: 1,
    user: {
      name: 'Max',
      avatar: 'img/avatar-max.jpg'
    },
    rating: 4,
    comment: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    date: '2019-04-24'
  },
  {
    id: 2,
    offerID: 2,
    user: {
      name: 'Angelina',
      avatar: 'img/avatar-angelina.jpg'
    },
    rating: 5,
    comment: 'Perfect location and amazing views! The apartment was clean and had everything we needed for our stay.',
    date: '2019-05-15'
  },
  {
    id: 3,
    offerID: 4,
    user: {
      name: 'John',
      avatar: 'img/avatar-max.jpg'
    },
    rating: 3,
    comment: 'Good apartment but could use some updates. The location is great though.',
    date: '2019-06-10'
  }
];


export const getReviewsByOfferId = (offerID: number) => (reviews.filter((review) => review.offerID === offerID));
