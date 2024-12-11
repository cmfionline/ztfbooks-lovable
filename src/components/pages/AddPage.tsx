import PageForm from "./PageForm";

const AddPage = () => {
  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Page</h1>
        <PageForm />
      </div>
    </div>
  );
};

export default AddPage;