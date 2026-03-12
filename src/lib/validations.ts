import { z } from "zod";

export const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required").max(20),
  city: z.string().max(100).optional().default(""),
  occupation: z.string().max(200).optional().default(""),
  experience: z.string().max(200).optional().default(""),
  reason: z.string().max(2000).optional().default(""),
  tier: z.enum(["20", "50", "100"]).default("50"),
  paymentMethod: z.enum(["moolre", "paystack"]).default("moolre"),
  network: z.enum(["MTN", "TELECEL", "AIRTELTIGO"]).optional().default("MTN"),
  momoNumber: z.string().max(20).optional().default(""),
  applicationId: z.string().optional().default(""),
});

export const autosaveSchema = z.object({
  firstName: z.string().max(100).optional().default(""),
  lastName: z.string().max(100).optional().default(""),
  email: z.string().max(200).optional().default(""),
  phone: z.string().max(20).optional().default(""),
  city: z.string().max(100).optional().default(""),
  occupation: z.string().max(200).optional().default(""),
  experience: z.string().max(200).optional().default(""),
  reason: z.string().max(2000).optional().default(""),
  tier: z.string().optional().default("50"),
});

export const emailStudentsSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  body: z.string().min(1, "Message body is required").max(10000),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type AutosaveInput = z.infer<typeof autosaveSchema>;
export type EmailStudentsInput = z.infer<typeof emailStudentsSchema>;
