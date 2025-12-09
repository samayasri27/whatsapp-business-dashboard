import { z } from "zod";

// Contact validation schema
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Campaign validation schema
export const campaignSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  template: z.string().min(1, "Please select a template"),
  contactSource: z.enum(["all", "tags", "sheet"]),
  contactTags: z.array(z.string()).optional(),
  sheet: z.string().optional(),
  scheduledDate: z.string().optional(),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;

// Message validation schema
export const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty").max(4096, "Message is too long"),
  phone: z.string().min(10, "Invalid phone number"),
});

export type MessageFormData = z.infer<typeof messageSchema>;

// Profile validation schema
export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional(),
  company: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Template validation schema
export const templateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.enum(["marketing", "utility", "transactional", "authentication"]),
  language: z.string().min(2, "Please select a language"),
  content: z.string().min(10, "Content must be at least 10 characters").max(1024, "Content is too long"),
});

export type TemplateFormData = z.infer<typeof templateSchema>;

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup validation schema
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Settings validation schema
export const settingsSchema = z.object({
  language: z.string(),
  timezone: z.string(),
  sessionTimeout: z.string(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
