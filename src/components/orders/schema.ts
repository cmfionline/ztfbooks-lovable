import { z } from "zod";

export const orderSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "cancelled"], {
    required_error: "Please select an order status",
  }),
  payment_status: z.enum(["pending", "paid", "failed", "refunded"], {
    required_error: "Please select a payment status",
  }),
  notes: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof orderSchema>;