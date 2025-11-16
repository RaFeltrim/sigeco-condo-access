/**
 * UnitCombobox Component
 * MRD-RBF-005: Combobox with search for unit selection
 */

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/utils/cn";
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

export interface Unit {
  numero: string;
  bloco: string;
  tipo: string;
  status: string;
}

export interface UnitComboboxProps {
  units: Unit[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export function UnitCombobox({
  units,
  value,
  onChange,
  placeholder = "Selecione a unidade",
  emptyMessage = "Nenhuma unidade encontrada",
}: UnitComboboxProps) {
  const [open, setOpen] = React.useState(false);
  
  // Find selected unit
  const selectedUnit = units.find(
    (unit) => `Apto ${unit.numero}` === value
  );
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          aria-label="Selecionar unidade"
        >
          {selectedUnit ? (
            <span>
              Apto {selectedUnit.numero} - {selectedUnit.tipo}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
            <CommandInput 
              placeholder="Buscar unidade..." 
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {units.map((unit) => {
              const unitValue = `Apto ${unit.numero}`;
              const isSelected = value === unitValue;
              
              return (
                <CommandItem
                  key={unit.numero}
                  value={`${unit.numero} ${unit.bloco} ${unit.tipo}`}
                  onSelect={() => {
                    onChange(unitValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Apto {unit.numero}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        Bloco {unit.bloco}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {unit.tipo}
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
