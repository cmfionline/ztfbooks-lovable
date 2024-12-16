import { z } from "zod";

// Zod schemas for runtime validation
export const notificationScheduleSchema = z.object({
  type: z.enum(["immediate", "scheduled", "recurring"]),
  scheduledFor: z.string().optional(),
  recurringSchedule: z.object({
    frequency: z.enum(["daily", "weekly", "monthly"]),
    time: z.string()
  }).optional(),
});

export const notificationTargetSchema = z.object({
  type: z.enum(["all", "segment", "specific"]),
  segment: z.string().optional(),
  userIds: z.array(z.string()).optional(),
});

export const notificationSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  message: z.string()
    .min(1, "Message is required")
    .max(500, "Message must not exceed 500 characters"),
  imageUrl: z.string().url().optional(),
  scheduleType: z.enum(["immediate", "scheduled", "recurring"]),
  scheduledFor: z.string().optional(),
  recurringSchedule: z.object({
    frequency: z.enum(["daily", "weekly", "monthly"]),
    time: z.string()
  }).optional(),
  targetAudience: z.object({
    type: z.enum(["all", "segment", "specific"]),
    segment: z.string().optional(),
    userIds: z.array(z.string()).optional(),
  }),
});

// TypeScript interfaces derived from zod schemas
export type NotificationSchedule = z.infer<typeof notificationScheduleSchema>;
export type NotificationTarget = z.infer<typeof notificationTargetSchema>;
export type NotificationFormData = z.infer<typeof notificationSchema>;

// Type guard functions
export const isNotificationResponse = (data: unknown): data is { id: string } => {
  return typeof data === 'object' && data !== null && 'id' in data;
};

export const isErrorResponse = (error: unknown): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error;
};

// API response types
export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  scheduleType: "immediate" | "scheduled" | "recurring";
  scheduledFor?: string;
  recurringSchedule?: {
    frequency: "daily" | "weekly" | "monthly";
    time: string;
  };
  targetAudience: {
    type: "all" | "segment" | "specific";
    segment?: string;
    userIds?: string[];
  };
  status: "pending" | "sent" | "failed";
  createdAt: string;
  sentAt?: string;
}

export interface NotificationError {
  message: string;
  code?: string;
  details?: string;
}

// Helper function to transform form data to database format
export const transformFormDataToDb = (formData: NotificationFormData) => {
  return {
    title: formData.title,
    message: formData.message,
    image_url: formData.imageUrl,
    schedule_type: formData.scheduleType,
    scheduled_for: formData.scheduledFor,
    recurring_schedule: formData.recurringSchedule,
    target_audience: formData.targetAudience,
  };
};