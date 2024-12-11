import { Control, UseFormWatch } from "react-hook-form";
import { AdFormValues } from "../schema";
import { DiscountTypeField } from "./discount/DiscountTypeField";
import { DiscountValueFields } from "./discount/DiscountValueFields";
import { DiscountDateFields } from "./discount/DiscountDateFields";
import { StackableDiscountField } from "./discount/StackableDiscountField";

interface DiscountFieldsProps {
  control: Control<AdFormValues>;
  watch: UseFormWatch<AdFormValues>;
}

export const DiscountFields = ({ control, watch }: DiscountFieldsProps) => {
  const discountType = watch("discount_type");

  return (
    <div className="space-y-4">
      <DiscountTypeField control={control} />
      <DiscountValueFields control={control} discountType={discountType} />
      <DiscountDateFields control={control} />
      <StackableDiscountField control={control} />
    </div>
  );
};