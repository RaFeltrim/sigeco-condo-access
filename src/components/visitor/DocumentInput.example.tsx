/**
 * Example Component: Document Input with Validation
 * Demonstrates how to use the useDocumentInput hook
 */

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocumentInput } from '@/hooks/useDocumentInput';

export function DocumentInputExample() {
  const document = useDocumentInput();

  return (
    <div className="space-y-2">
      <Label htmlFor="documento">
        Documento (CPF ou RG)
        {document.type !== 'UNKNOWN' && (
          <span className="ml-2 text-xs text-muted-foreground">
            ({document.type})
          </span>
        )}
      </Label>
      
      <Input
        id="documento"
        type="text"
        placeholder="Digite o CPF ou RG"
        value={document.formattedValue}
        onChange={(e) => document.onChange(e.target.value)}
        onBlur={document.onBlur}
        className={document.error ? 'border-red-500' : ''}
        aria-invalid={!!document.error}
        aria-describedby={document.error ? 'documento-error' : undefined}
      />
      
      {document.error && (
        <p id="documento-error" className="text-sm text-red-500">
          {document.error}
        </p>
      )}
      
      {document.isValid && (
        <p className="text-sm text-green-600">
          ✓ {document.type} válido
        </p>
      )}
    </div>
  );
}

/**
 * Usage Example in a Form:
 * 
 * function VisitorForm() {
 *   const document = useDocumentInput();
 *   
 *   const handleSubmit = (e: React.FormEvent) => {
 *     e.preventDefault();
 *     
 *     if (!document.isValid) {
 *       // Show error
 *       return;
 *     }
 *     
 *     // Submit form with document.value (unformatted)
 *     console.log('Document:', document.value);
 *     console.log('Type:', document.type);
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <DocumentInputExample />
 *       <button type="submit">Submit</button>
 *     </form>
 *   );
 * }
 */
