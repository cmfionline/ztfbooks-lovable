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
  };

  const handleDownloadExcel = () => {
    console.log("Downloading Excel report...");
  };

  return (
    <div className="flex flex-col gap-4 mb-8 bg-gradient-to-r from-purple-light/50 to-white p-4 rounded-lg">
      <div className="flex flex-wrap gap-4 items-center">
        <TimeFilter value="this_week" onValueChange={(value) => console.log(value)} />
        
        <Select>
          <SelectTrigger className="w-[180px] bg-white/95 border-purple-light/50 focus:ring-purple text-gray-700">
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-light/50 shadow-lg z-50">
            {authors.map((author) => (
              <SelectItem 
                key={author} 
                value={author.toLowerCase()}
                className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700"
              >
                {author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px] bg-white/95 border-purple-light/50 focus:ring-purple text-gray-700">
            <SelectValue placeholder="Select series" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-light/50 shadow-lg z-50">
            {series.map((s) => (
              <SelectItem 
                key={s} 
                value={s.toLowerCase()}
                className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700"
              >
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px] bg-white/95 border-purple-light/50 focus:ring-purple text-gray-700">
            <SelectValue placeholder="Select tags" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-light/50 shadow-lg z-50">
            {tags.map((tag) => (
              <SelectItem 
                key={tag} 
                value={tag.toLowerCase()}
                className="hover:bg-purple-light/10 focus:bg-purple-light/10 text-gray-700"
              >
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
          className="bg-white/95 hover:bg-purple-light/10 border-purple-light/50 text-gray-700"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button 
          variant="outline" 
          onClick={handleDownloadExcel}
          className="bg-white/95 hover:bg-purple-light/10 border-purple-light/50 text-gray-700"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Download Excel
        </Button>
      </div>
    </div>
  );
};