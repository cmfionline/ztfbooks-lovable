import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export const RedeemVoucher = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: { code: string }) => {
    setIsLoading(true);
    try {
      // First get the voucher details
      const { data: voucher, error: voucherError } = await supabase
        .from("vouchers")
        .select("*")
        .eq("code", values.code)
        .single();

      if (voucherError) throw new Error("Invalid voucher code");

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("User not authenticated");

      // Call the redeem-voucher function
      const { error } = await supabase.functions.invoke("redeem-voucher", {
        body: {
          voucherId: voucher.id,
          userId: user.id,
        },
      });

      if (error) throw error;

      toast.success("Voucher redeemed successfully");
      navigate("/library"); // Assuming there's a library page to view redeemed books
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Redeem Voucher</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...form.register("code")}
            placeholder="Enter voucher code"
            className="border-purple-light focus:border-purple"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple hover:bg-purple/90 text-white"
        >
          {isLoading ? "Redeeming..." : "Redeem Voucher"}
        </Button>
      </form>
    </div>
  );
};