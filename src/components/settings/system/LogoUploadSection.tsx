import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LogoUploadSectionProps {
  type: 'admin' | 'client';
  logoUrl?: string | null;
  onUpload: (file: File, type: 'admin' | 'client') => void;
}

export const LogoUploadSection = ({ type, logoUrl, onUpload }: LogoUploadSectionProps) => {
  return (
    <div>
      <FormLabel>{type === 'admin' ? 'Admin Portal Logo' : 'Client Portal Logo'}</FormLabel>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file, type);
        }}
        className="max-w-md border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
      />
      {logoUrl && (
        <img 
          src={logoUrl} 
          alt={`${type === 'admin' ? 'Admin' : 'Client'} Logo`} 
          className="h-12 w-auto object-contain mt-2"
        />
      )}
    </div>
  );
};