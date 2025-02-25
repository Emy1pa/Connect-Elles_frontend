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

export interface Favorite {
  _id: string;
  blog: {
    _id: string;
    title: string;
  };
}
