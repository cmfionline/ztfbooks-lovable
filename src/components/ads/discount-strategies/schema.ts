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
    .transform((val, ctx: z.RefinementCtx & { parent?: { type?: string } }) => {
      if (ctx.parent?.type === "percentage" && val > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Percentage value must not exceed 100%",
        });
        return z.NEVER;
      }
      return val;
    }),
  min_purchase_amount: z.number()
    .min(0, "Minimum purchase amount must be greater than or equal to 0")
    .optional()
    .nullable(),
  min_books_count: z.number()
    .int()
    .min(0, "Minimum books count must be greater than or equal to 0")
    .optional()
    .nullable(),
  is_stackable: z.boolean().default(false),
});

export type DiscountStrategyFormValues = z.infer<typeof discountStrategySchema>;