import { Routes, Route } from "react-router-dom";
import ContentBlocks from "@/pages/ContentBlocks";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";
import { useParams } from "react-router-dom";

// Separate component for edit form
const EditContentBlock = () => {
  const { id } = useParams();
  return <ContentBlockForm initialData={{ id }} onSuccess={() => {}} />;
};

// Separate component for add form
const AddContentBlock = () => {
  return <ContentBlockForm onSuccess={() => {}} />;
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