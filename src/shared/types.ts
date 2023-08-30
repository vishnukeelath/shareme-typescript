export interface User {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

export interface Category {
  name: string;
  image: string;
}

export interface Pins {
  about: string;
  category: string;
  destination: string;
  id: string;
  image: string;
  title: string;
  postedBy: User;
}

export interface Comment {
  comment: string;
  postedBy: User;
  id: string;
}
