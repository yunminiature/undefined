import { z } from 'zod';

/*
 * ЛОГИН
 * - 3..20 символов
 * - только латиница, цифры, дефис, нижнее подчеркивание
 * - обязательно хотя бы одна буква (не может состоять только из цифр/символов)
 * - без пробелов
 */
const loginRegex = /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/;

/*
 * ПАРОЛЬ
 * - 8..40 символов
 * - минимум одна заглавная буква
 * - минимум одна цифра
 * - без пробелов
 */
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)\S{8,40}$/;

export const signInSchema = z.object({
  login: z
    .string()
    .trim()
    .regex(loginRegex, '3–20 characters: at least one letter, numbers, «-» and «_»'),
  password: z
    .string()
    .regex(passwordRegex, '8-40 characters: at least one uppercase letter and number, no spaces'),
});

export type SignInValues = z.infer<typeof signInSchema>;
