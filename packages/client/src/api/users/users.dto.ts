import { User } from '@/components/types';

export type ChangePasswordRequest = {
  oldPassword: string;
  newPassword: string;
};
export type ChangePasswordResponse = void;

export type UpdateUserAvatarRequest = FormData;
export type UpdateUserAvatarResponse = User;
