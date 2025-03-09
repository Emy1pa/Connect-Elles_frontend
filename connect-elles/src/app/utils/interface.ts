export interface RegisterFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  profileImage: File | null;
}

export interface DecodedToken {
  id: string;
  userRole: "admin" | "mentor" | "normal-user";
  exp: number;
}

export interface Category {
  _id: string;
  title: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  summary: string;
  blogImage: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category?: {
    _id: string;
    title: string;
  };
  user?: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    userRole: string;
    profileImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  title: string;
  serviceImage: string;
  category?: {
    _id: string;
    title: string;
  };
  status: string;
  duration: number;
  numberOfPlaces: number;
  price: number;
  createdAt: string;
  description: string;
  user?: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    userRole: string;
    profileImage?: string;
  };
}
export interface Reservation {
  _id: string;
  reservationDate: string;
  reservationStatus: string;
  service: Service | null;
}

export interface Favorite {
  _id: string;
  blog: Blog;
}

export interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };
  blog: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationErrors {
  reservationDate?: string;
  cardHolderName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  general?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
}

export interface Skill {
  _id: string;
  title: string;
  description: string;
  user: string;
}

export interface Mentor {
  _id: string;
  fullName: string;
  email: string;
  username?: string;
  profileImage?: string;
  userRole?: string;
}
export interface ReservationFormData {
  reservationDate: string;
  cardHolderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
}
