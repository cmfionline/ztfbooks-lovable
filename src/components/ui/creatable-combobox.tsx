import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  value: string;
  label: string;
};

interface CreatableComboboxProps {
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  onCreateOption: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

export function CreatableCombobox({
  value,
  options,
  onChange,
  onCreateOption,
  placeholder = "Select an option",
  emptyText = "No options found.",
  className,
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleCreateOption = () => {
    if (inputValue) {
      onCreateOption(inputValue);
      setInputValue("");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Search or create...`}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>
            {emptyText}
            <Button
              variant="ghost"
              className="w-full mt-2 justify-start"
              onClick={handleCreateOption}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create "{inputValue}"
            </Button>
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}