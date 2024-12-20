import { useParams, useNavigate } from "react-router-dom";
import { ContentBlockForm } from "../ContentBlockForm";
import { useContentBlock } from "../hooks/useContentBlock";
import { Loader2 } from "lucide-react";

export const EditContentBlockView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: contentBlock, isLoading } = useContentBlock(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!contentBlock) {
    return <div>Content block not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Content Block</h1>
      <ContentBlockForm 
        initialData={contentBlock}
        onSuccess={() => navigate("/content-blocks")}
      />
    </div>
  );
};