import { useParams, useNavigate } from "react-router-dom";
import { ContentBlockForm } from "../ContentBlockForm";
import { useContentBlock } from "../hooks/useContentBlock";
import { Loader2 } from "lucide-react";
import { QueryErrorBoundary } from "@/components/common/QueryErrorBoundary";
import { z } from "zod";

const idSchema = z.string().uuid("Invalid content block ID format");

export const EditContentBlockView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Validate ID before using it
  try {
    if (id) {
      idSchema.parse(id);
    }
  } catch (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 rounded-lg bg-destructive/10 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Invalid Content Block ID</h2>
          <p className="mb-4">The provided ID is not in the correct format.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/content-blocks")}
            className="mt-2"
          >
            Back to Content Blocks
          </Button>
        </div>
      </div>
    );
  }

  const { data: contentBlock, isLoading, error } = useContentBlock(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contentBlock) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-6 rounded-lg bg-destructive/10 text-destructive">
          <h2 className="text-lg font-semibold mb-2">Content Block Not Found</h2>
          <p className="mb-4">The requested content block could not be found.</p>
          <Button 
            variant="outline" 
            onClick={() => navigate("/content-blocks")}
            className="mt-2"
          >
            Back to Content Blocks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <QueryErrorBoundary>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Content Block</h1>
        <ContentBlockForm 
          initialData={contentBlock}
          onSuccess={() => navigate("/content-blocks")}
        />
      </div>
    </QueryErrorBoundary>
  );
};