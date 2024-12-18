import { Control, useWatch } from "react-hook-form";
import { PricingToggle } from "./PricingToggle";
import { PriceField } from "./PriceField";
import { DiscountFields } from "./DiscountFields";

interface BookMetadataPriceProps {
  control: Control<any>;
}

export const BookMetadataPrice = ({ control }: BookMetadataPriceProps) => {
  const isFree = useWatch({
    control,
    name: "isFree",
  });

  const hasDiscount = useWatch({
    control,
    name: "hasDiscount",
  });

  return (
    <div className="space-y-4">
      <PricingToggle
        control={control}
        name="isFree"
        label="Free Book"
        description="Make this book available for free"
      />

      {!isFree && (
        <>
          <PriceField control={control} />
          <PricingToggle
            control={control}
            name="hasDiscount"
            label="Apply Discount"
            description="Enable discount pricing for this book"
          />
          {hasDiscount && <DiscountFields control={control} />}
        </>
      )}
    </div>
  );
};