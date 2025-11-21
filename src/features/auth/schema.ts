import z from 'zod';

export const registerFormSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    email: z.email().min(1, 'Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    image: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: z.email().min(1, 'Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;