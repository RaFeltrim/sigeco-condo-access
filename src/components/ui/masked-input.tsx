/**
 * MaskedInput Component
 * MRD-RBF-003: Input with automatic formatting masks
 */

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatPhone, formatCPF, formatDocument } from "@/lib/utils/validation";

export interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  mask: 'phone' | 'cpf' | 'document';
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, value, onChange, error, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      let formattedValue = inputValue;
      
      // Apply mask based on type
      switch (mask) {
        case 'phone':
          formattedValue = formatPhone(inputValue);
          break;
        case 'cpf':
          formattedValue = formatCPF(inputValue);
          break;
        case 'document':
          formattedValue = formatDocument(inputValue);
          break;
      }
      
      onChange(formattedValue);
    };
    
    return (
      <div className="space-y-1">
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
