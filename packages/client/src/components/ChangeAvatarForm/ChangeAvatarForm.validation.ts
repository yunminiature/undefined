import z from 'zod';
import { ALLOWED_TYPES, MAX_FILE_SIZE } from './ChangeAvatarForm.constants';

export const avatarSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Max size is 2MB')
    .refine((file) => ALLOWED_TYPES.includes(file.type), 'Unsupported format'),
});
