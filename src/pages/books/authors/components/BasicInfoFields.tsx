import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { AuthorFormValues } from "../schema";
import { PersonalInfoFields } from "./fields/PersonalInfoFields";
import { ContactFields } from "./fields/ContactFields";
import { SocialMediaFields } from "./fields/SocialMediaFields";

type BasicInfoFieldsProps = {
  control: Control<AuthorFormValues>;
  currentPhoto?: string;
};

export const BasicInfoFields = ({ control, currentPhoto }: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <PersonalInfoFields control={control} />
      
      <FormField
        control={control}
        name="photo"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem className="col-span-2">
            <FormLabel>Photo</FormLabel>
            <FormControl>
              <input
                {...field}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                  }
                }}
                className="border-purple-light focus:border-purple file:bg-purple file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-purple/90"
              />
            </FormControl>
            {currentPhoto && (
              <img 
                src={currentPhoto} 
                alt="Current author photo" 
                className="mt-2 h-32 w-auto object-contain rounded-md"
              />
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Biography</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter author's biography"
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ContactFields control={control} />
      <SocialMediaFields control={control} />
    </div>
  );
};