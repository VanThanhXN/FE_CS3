export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  avatar: string;
  role: string;
  createdAt: string;
}

// Các interface khác nếu cần
