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
  min_purchase_amount: z.number()
    .min(0, "Minimum purchase amount must be greater than or equal to 0")
    .optional(),
  min_books_count: z.number().int()
    .min(0, "Minimum books count must be greater than or equal to 0")
    .optional(),
  is_stackable: z.boolean().default(false),
  start_date: z.string()
    .min(1, "Start date is required"),
  end_date: z.string()
    .min(1, "End date is required")
    .superRefine((date, ctx: z.RefinementCtx & { parent: any }) => {
      type ParentInput = { start_date?: string };
      const parent = ctx.parent as ParentInput;
      const startDate = parent?.start_date;
      
      if (!startDate) return;
      
      if (new Date(date) <= new Date(startDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End date must be after start date"
        });
      }
    }),
});

export type DiscountStrategyFormValues = z.infer<typeof discountStrategySchema>;