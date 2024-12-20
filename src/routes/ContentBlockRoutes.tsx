import { Routes, Route } from "react-router-dom";
import ContentBlocks from "@/pages/ContentBlocks";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";

const AddContentBlock = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add Content Block</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <ContentBlockForm />
      </div>
    </div>
  );
};

const EditContentBlock = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Content Block</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        <ContentBlockForm />
      </div>
    </div>
  );
};

export const ContentBlockRoutes = () => {
  return (
    <Routes>
      <Route index element={<ContentBlocks />} />
      <Route path="add" element={<AddContentBlock />} />
      <Route path=":id/edit" element={<EditContentBlock />} />
    </Routes>
  );
};