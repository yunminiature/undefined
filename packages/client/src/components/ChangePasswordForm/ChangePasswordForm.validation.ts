import z from 'zod';

export const schema = z
  .object({
    oldPassword: z.string().min(8, 'Minimum 8 characters'),
    newPassword: z
      .string()
      .min(8, 'Minimum 8 characters')
      .max(40, 'Maximum 40 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/\d/, 'Must contain at least one digit'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
