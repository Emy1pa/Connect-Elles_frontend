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
