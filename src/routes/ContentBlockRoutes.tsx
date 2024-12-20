import { Routes, Route } from "react-router-dom";
import ContentBlocks from "@/pages/ContentBlocks";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";
import { useNavigate } from "react-router-dom";

const AddContentBlock = () => {
  const navigate = useNavigate();
  return (
    <ContentBlockForm 
      onSuccess={() => {
        navigate("/content-blocks");
      }} 
    />
  );
};

const EditContentBlock = () => {
  const navigate = useNavigate();
  return (
    <ContentBlockForm 
      initialData={{ id: "" }} 
      onSuccess={() => {
        navigate("/content-blocks");
      }}
    />
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