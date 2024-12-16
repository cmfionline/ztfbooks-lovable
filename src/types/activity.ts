export interface Activity {
  id: string;
  activity_type: string;
  created_at: string;
  books: {
    title: string;
  };
}