import { z } from 'zod';

// Error messages
const minLengthErrorMessage = 'Password must be at least 8 characters long';
const maxLengthErrorMessage = 'Password must not exceed 20 characters';
const uppercaseErrorMessage = 'Password must contain at least one uppercase letter';
const lowercaseErrorMessage = 'Password must contain at least one lowercase letter';
const numberErrorMessage = 'Password must contain at least one number';
const specialCharacterErrorMessage =
  'Password must contain at least one special character (!@#$%^&*)';
const passwordMismatchErrorMessage = 'Passwords do not match';

// Reusable password schema
const passwordSchema = z
  .string()
  .min(8, { message: minLengthErrorMessage })
  .max(20, { message: maxLengthErrorMessage })
  .refine(password => /[A-Z]/.test(password), {
    message: uppercaseErrorMessage,
  })
  .refine(password => /[a-z]/.test(password), {
    message: lowercaseErrorMessage,
  })
  .refine(password => /[0-9]/.test(password), { message: numberErrorMessage })
  .refine(password => /[!@#$%^&*]/.test(password), {
    message: specialCharacterErrorMessage,
  });

// Register schema
export const registerSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Invalid email format' })
      .nonempty({ message: 'Email is required' }),
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .nonempty({ message: 'First name is required' }),
    password: passwordSchema,
    password2: z.string().nonempty({ message: 'Password2 is required' }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.password2) {
      ctx.addIssue({
        code: 'custom',
        path: ['password2'],
        message: passwordMismatchErrorMessage,
      });
    }
  });

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .nonempty({ message: 'Email is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});
