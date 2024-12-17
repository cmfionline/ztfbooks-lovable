import { useState } from "react";
import { PortalFaqList } from "@/components/portal/faqs/PortalFaqList";
import { FaqMenu } from "@/components/portal/faqs/FaqMenu";

const PortalSupport = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  return (
    <div className="container max-w-7xl py-8">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <FaqMenu onGroupSelect={setSelectedGroupId} />
        </div>
        <div className="md:col-span-3">
          <PortalFaqList selectedGroupId={selectedGroupId} />
        </div>
      </div>
    </div>
  );
};

export default PortalSupport;