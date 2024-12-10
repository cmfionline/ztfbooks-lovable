import { TimeFilter } from "./TimeFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

const authors = ["All Authors", "Zacharias T. Fomum", "Other Contributors"];
const series = ["All Series", "Christian Living", "Prayer", "Leadership", "Discipleship"];
const tags = ["All Tags", "Prayer", "Fasting", "Holy Spirit", "Leadership", "Discipleship"];

export const Filters = () => {
  const handleDownloadPDF = () => {
    console.log("Downloading PDF report...");
    // Implement PDF download logic
  };

  const handleDownloadExcel = () => {
    console.log("Downloading Excel report...");
    // Implement Excel download logic
  };

  return (
    <div className="flex flex-col gap-4 mb-8 bg-gradient-to-r from-purple-light/50 to-white p-4 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center">
        <TimeFilter value="this_week" onValueChange={(value) => console.log(value)} />
        
        <Select>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent>
            {authors.map((author) => (
              <SelectItem key={author} value={author.toLowerCase()}>
                {author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select series" />
          </SelectTrigger>
          <SelectContent>
            {series.map((s) => (
              <SelectItem key={s} value={s.toLowerCase()}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select tags" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag.toLowerCase()}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleDownloadPDF}
          className="bg-white hover:bg-purple-light/50"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDownloadExcel}
          className="bg-white hover:bg-purple-light/50"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download Excel
        </Button>
      </div>
    </div>
  );
};