import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AdminTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Sales Performance</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};