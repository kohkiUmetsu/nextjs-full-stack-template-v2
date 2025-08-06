// User status types matching the database schema
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'deleted';

// User type definition
export type User = {
  id: string;
  email: string;
  name?: string | null;
  profileImageUrl?: string | null;
  birthYear?: number | null;
  birthMonth?: number | null;
  birthDay?: number | null;
  phoneNumber?: string | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt?: Date | null;
};

// User profile update input type
export interface UserUpdateInput {
  name?: string;
  profileImageUrl?: string;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  phoneNumber?: string;
}