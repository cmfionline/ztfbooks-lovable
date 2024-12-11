import { Routes, Route } from "react-router-dom";
import VouchersList from "@/components/vouchers/VouchersList";
import CreateVoucher from "@/components/vouchers/CreateVoucher";
import VoucherAnalytics from "@/components/vouchers/VoucherAnalytics";

const Vouchers = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<VouchersList />} />
          <Route path="/create" element={<CreateVoucher />} />
          <Route path="/analytics" element={<VoucherAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default Vouchers;