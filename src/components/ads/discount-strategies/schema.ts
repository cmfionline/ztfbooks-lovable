import * as z from "zod";

export const discountStrategySchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  type: z.enum(["percentage", "fixed", "volume"], {
    required_error: "Please select a discount type",
  }),
  value: z.number()
    .min(0, "Value must be greater than or equal to 0")
    .max(100, "Value must not exceed 100 for percentage discounts"),
  minPurchaseAmount: z.number()
    .min(0, "Minimum purchase amount must be greater than or equal to 0")
    .optional(),
  minBooksCount: z.number().int()
    .min(0, "Minimum books count must be greater than or equal to 0")
    .optional(),
  isStackable: z.boolean().default(false),
});

export type DiscountStrategyFormValues = z.infer<typeof discountStrategySchema>;