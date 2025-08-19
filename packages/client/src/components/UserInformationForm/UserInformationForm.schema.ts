import { z } from 'zod';

// LOGIN: 3–20, латиница/цифры, "-" и "_", минимум одна буква
export const loginRegex = /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/;

// NAME: латиница или кириллица, первая заглавная, 2–50, допустим только дефис
export const nameRegex = /^[A-ZА-Я][a-zа-яA-ZА-Я-]{1,49}$/;

// EMAIL: латиница, @, домен с буквами перед точкой, TLD из букв
export const emailRegex = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)*(?:[A-Za-z0-9-]*[A-Za-z][A-Za-z0-9-]*)\.[A-Za-z]+$/;

// PHONE: 10–15 цифр, может начинаться с +
export const phoneRegex = /^\+?\d{10,15}$/;

export const userInfoSchema = z.object({
  login: z.string().trim().regex(loginRegex, '3–20 characters: at least one letter, numbers, «-» and «_»'),
  first_name: z
    .string()
    .trim()
    .regex(nameRegex, 'First letter uppercase, only Latin/Cyrillic letters or "-" (2–50 chars)'),
  second_name: z
    .string()
    .trim()
    .regex(nameRegex, 'First letter uppercase, only Latin/Cyrillic letters or "-" (2–50 chars)'),
  display_name: z.string().trim().min(1, 'Display name is required').max(50, 'Max 50 characters'),
  email: z.string().trim().regex(emailRegex, 'Invalid email format'),
  phone: z.string().trim().regex(phoneRegex, '10–15 characters, may start with +'),
});

export type UserInfoValues = z.infer<typeof userInfoSchema>;
