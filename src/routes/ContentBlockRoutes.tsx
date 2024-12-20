import { Routes, Route } from "react-router-dom";
import ContentBlocks from "@/pages/ContentBlocks";
import { ContentBlockForm } from "@/components/content-blocks/ContentBlockForm";
import { useNavigate, useParams } from "react-router-dom";

const AddContentBlock = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add Content Block</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ContentBlockForm 
          onSuccess={() => {
            navigate("/content-blocks");
          }} 
        />
      </div>
    </div>
  );
};

const EditContentBlock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Content Block</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ContentBlockForm 
          initialData={{ id: id || "" }} 
          onSuccess={() => {
            navigate("/content-blocks");
          }}
        />
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