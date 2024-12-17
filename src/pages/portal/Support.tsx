import { PortalFaqList } from "@/components/portal/faqs/PortalFaqList";

const PortalSupport = () => {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <PortalFaqList />
    </div>
  );
};

export default PortalSupport;