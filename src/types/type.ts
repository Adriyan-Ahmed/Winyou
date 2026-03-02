export type UserStatus = "active" | "inactive" | "suspended" | "banned";
export type UserRole = "user" | "admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
