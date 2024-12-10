import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const ztfBooks = [
  { title: "The Way of Life", downloads: 12340, revenue: "$12,340", language: "English", type: "Paid" },
  { title: "The Art of Working", downloads: 9560, revenue: "$9,560", language: "French", type: "Paid" },
  { title: "The Ministry of Fasting", downloads: 8450, revenue: "$8,450", language: "English", type: "Free" },
  { title: "The Way of Discipleship", downloads: 7890, revenue: "$7,890", language: "Spanish", type: "Paid" },
  { title: "The Power of the Holy Spirit", downloads: 6540, revenue: "$6,540", language: "Portuguese", type: "Free" },
];

export const ZTFBooks = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Books by Zacharias Tanee Fomum</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ztfBooks.map((book, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.downloads.toLocaleString()}</TableCell>
                  <TableCell>{book.revenue}</TableCell>
                  <TableCell>{book.language}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${book.type === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {book.type}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};