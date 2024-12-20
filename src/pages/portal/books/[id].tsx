import { useParams } from "react-router-dom";
import { BookDetailPage } from "./BookDetailPage";

const PortalBookDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Book ID is required</div>;
  }

  return <BookDetailPage bookId={id} />;
};

export default PortalBookDetailPage;