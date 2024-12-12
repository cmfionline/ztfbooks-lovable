import PageForm from "./PageForm";
import { FileText } from "lucide-react";

const AddPage = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-primary">
          <FileText className="w-8 h-8 text-purple" />
          Add New Page
        </h1>
        <PageForm />
      </div>
    </div>
  );
};

export default AddPage;