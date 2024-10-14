export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SanitizedUser
  extends Pick<User, "id" | "username" | "email"> {}
