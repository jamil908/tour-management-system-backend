import z, { object } from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Minimum 2 characters required" })
    .max(50, { message: "Maximum 50 characters allowed" }),

  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email({ message: "Invalid email format" }),

  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must include at least one special character",
    })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter",
    })
    .regex(/\d/, {
      message: "Password must include at least one number",
    }),

  phone: z
    .string()
    .regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, {
      message: "Phone number must be a valid Bangladeshi number",
    })
    .optional(),
  address: z
    .string()
    .max(200, { message: "Address must be at most 200 characters long" })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Minimum 2 characters required" })
    .max(50, { message: "Maximum 50 characters allowed" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must include at least one special character",
    })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter",
    })
    .regex(/\d/, {
      message: "Password must include at least one number",
    })
    .optional(),

  phone: z
    .string()
    .regex(/^(?:\+880|880|0)1[3-9]\d{8}$/, {
      message: "Phone number must be a valid Bangladeshi number",
    })
    .optional(),

  picture: z
    .string()
    .url({ message: "Picture must be a valid URL" })
    .optional(),

  address: z
    .string()
    .max(200, { message: "Address must be at most 200 characters long" })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),

  isDeleted: z.boolean({ invalid_type_error: "isDeleted must be a boolean" }).optional(),

  isActive: z.enum(Object.values(IsActive) as [string]).optional(),

  isVerified: z.boolean({ invalid_type_error: "isVerified must be a true or false" }).optional(),


});
