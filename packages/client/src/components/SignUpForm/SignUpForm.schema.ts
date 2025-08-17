import { z } from 'zod';

// LOGIN: 3–20, латиница/цифры, "-" и "_", минимум одна буква
export const loginRegex = /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/;

// PASSWORD: 8–40, минимум одна заглавная и одна цифра, без пробелов
export const passwordRegex = /^(?=.*[A-Z])(?=.*\d)\S{8,40}$/;

// EMAIL: латиница, @, домен с буквами перед точкой, TLD из букв
export const emailRegex =
  /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)*(?:[A-Za-z0-9-]*[A-Za-z][A-Za-z0-9-]*)\.[A-Za-z]+$/;

// NAME: латиница или кириллица, первая заглавная, 2–50, допустим только дефис
export const nameRegex = /^[A-ZА-Я][a-zа-яA-ZА-Я-]{1,49}$/;

// PHONE: 10–15 цифр, может начинаться с +
export const phoneRegex = /^\+?\d{10,15}$/;

export const signUpSchema = z
  .object({
    email: z
      .string()
      .trim()
      .regex(emailRegex, 'Invalid email format'),
    login: z
      .string()
      .trim()
      .regex(loginRegex, '3–20 characters: at least one letter, numbers, «-» and «_»'),
    first_name: z
      .string()
      .trim()
      .regex(nameRegex, 'First letter uppercase, only Latin/Cyrillic letters or "-" (2–50 chars)'),
    second_name: z
      .string()
      .trim()
      .regex(nameRegex, 'First letter uppercase, only Latin/Cyrillic letters or "-" (2–50 chars)'),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, '10–15 characters, may start with +'),
    password: z
      .string()
      .regex(passwordRegex, '8–40 characters: at least one uppercase letter and one digit, no spaces'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type SignUpValues = z.infer<typeof signUpSchema>;
