import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, AlertCircle, Loader2 } from "lucide-react";
import { useNameInput } from "@/hooks/useNameInput";
import { useDocumentInput } from "@/hooks/useDocumentInput";
import { ERROR_MESSAGES } from "@/lib/constants/errorMessages";
import { useToast } from "@/hooks/use-toast";

// Destinations array with apartments and common areas
const DESTINATIONS = [
  // Apartments - Floor 1
  { value: "apto-101", label: "Apto 101", category: "apartment" },
  { value: "apto-102", label: "Apto 102", category: "apartment" },
  { value: "apto-103", label: "Apto 103", category: "apartment" },
  { value: "apto-104", label: "Apto 104", category: "apartment" },
  
  // Apartments - Floor 2
  { value: "apto-201", label: "Apto 201", category: "apartment" },
  { value: "apto-202", label: "Apto 202", category: "apartment" },
  { value: "apto-203", label: "Apto 203", category: "apartment" },
  { value: "apto-204", label: "Apto 204", category: "apartment" },
  { value: "apto-205", label: "Apto 205", category: "apartment" },
  
  // Apartments - Floor 3
  { value: "apto-301", label: "Apto 301", category: "apartment" },
  { value: "apto-302", label: "Apto 302", category: "apartment" },
  { value: "apto-303", label: "Apto 303", category: "apartment" },
  { value: "apto-304", label: "Apto 304", category: "apartment" },
  
  // Common Areas
  { value: "salao-festas", label: "Salão de Festas", category: "common_area" },
  { value: "academia", label: "Academia", category: "common_area" },
  { value: "piscina", label: "Piscina", category: "common_area" },
  { value: "churrasqueira", label: "Churrasqueira", category: "common_area" },
  { value: "playground", label: "Playground", category: "common_area" },
  { value: "quadra", label: "Quadra Esportiva", category: "common_area" },
  
  // Administration
  { value: "administracao", label: "Administração", category: "admin" },
  { value: "sindico", label: "Síndico", category: "admin" },
  { value: "zelador", label: "Zelador", category: "admin" },
] as const;

export interface VisitorFormData {
  nome: string;
  documento: string;
  destino: string;
  motivo: string;
}

interface VisitorFormProps {
  onSubmit: (data: VisitorFormData) => void;
}

export function VisitorForm({ onSubmit }: VisitorFormProps) {
  const nameInput = useNameInput();
  const documentInput = useDocumentInput();
  const [destino, setDestino] = useState("");
  const [motivo, setMotivo] = useState("");
  const [destinoError, setDestinoError] = useState<string | null>(null);
  const [destinoTouched, setDestinoTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Refs for focus management
  const nomeRef = React.useRef<HTMLInputElement>(null);
  const documentoRef = React.useRef<HTMLInputElement>(null);
  const destinoRef = React.useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Validate all fields
    let hasErrors = false;
    let firstInvalidField: string | null = null;
    
    // Validate name
    if (!nameInput.value || nameInput.value.trim().length === 0) {
      nameInput.onBlur();
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = 'nome';
    } else if (!nameInput.isValid) {
      nameInput.onBlur();
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = 'nome';
    }
    
    // Validate document
    if (!documentInput.value || documentInput.value.trim().length === 0) {
      documentInput.onBlur();
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = 'documento';
    } else if (!documentInput.isValid) {
      documentInput.onBlur();
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = 'documento';
    }
    
    // Validate destino
    setDestinoTouched(true);
    if (!destino || destino.trim().length === 0) {
      setDestinoError(ERROR_MESSAGES.destino.required);
      hasErrors = true;
      if (!firstInvalidField) firstInvalidField = 'destino';
    } else {
      setDestinoError(null);
    }
    
    // If validation fails, focus on first invalid field and prevent submission
    if (hasErrors) {
      if (firstInvalidField === 'nome' && nomeRef.current) {
        nomeRef.current.focus();
      } else if (firstInvalidField === 'documento' && documentoRef.current) {
        documentoRef.current.focus();
      } else if (firstInvalidField === 'destino' && destinoRef.current) {
        destinoRef.current.focus();
      }
      
      // Show validation error toast
      toast({
        title: 'Erro de validação',
        description: ERROR_MESSAGES.form.validationFailed,
        variant: 'destructive',
      });
      
      return;
    }
    
    // All validations passed - submit form
    try {
      setIsSubmitting(true);
      
      await onSubmit({
        nome: nameInput.formattedValue,
        documento: documentInput.formattedValue,
        destino,
        motivo,
      });
      
      // Reset form on success
      nameInput.reset();
      documentInput.reset();
      setDestino("");
      setMotivo("");
      setDestinoError(null);
      setDestinoTouched(false);
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Show error toast
      toast({
        title: 'Erro ao registrar entrada',
        description: ERROR_MESSAGES.form.submissionFailed,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-accent to-accent-light text-accent-foreground rounded-t-xl">
        <CardTitle className="flex items-center gap-3">
          <UserPlus className="h-6 w-6" aria-hidden="true" />
          Registrar Nova Entrada
        </CardTitle>
        <CardDescription className="text-accent-foreground/90">
          Cadastre a entrada de visitantes no condomínio
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          aria-label="Formulário de registro de visitante"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Visitante *</Label>
            <div className="relative">
              <Input
                ref={nomeRef}
                id="nome"
                name="nome"
                type="text"
                placeholder="Digite o nome completo"
                value={nameInput.value}
                onChange={(e) => nameInput.onChange(e.target.value)}
                onBlur={nameInput.onBlur}
                required
                disabled={isSubmitting}
                className={nameInput.error ? "border-destructive focus-visible:ring-destructive pr-10" : ""}
                aria-invalid={!!nameInput.error}
                aria-describedby={nameInput.error ? "nome-error nome-hint" : "nome-hint"}
                aria-required="true"
                aria-label="Nome completo do visitante"
                autoComplete="name"
              />
              {nameInput.error && (
                <AlertCircle 
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" 
                  aria-hidden="true"
                />
              )}
            </div>
            <p id="nome-hint" className="text-xs text-muted-foreground sr-only">
              Digite apenas letras e espaços. Mínimo 3 caracteres.
            </p>
            {nameInput.error && (
              <p id="nome-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {nameInput.error}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documento">Documento *</Label>
            <div className="relative">
              <Input
                ref={documentoRef}
                id="documento"
                name="documento"
                type="text"
                placeholder="CPF, RG ou outro documento"
                value={documentInput.value}
                onChange={(e) => documentInput.onChange(e.target.value)}
                onBlur={documentInput.onBlur}
                required
                disabled={isSubmitting}
                className={documentInput.error ? "border-destructive focus-visible:ring-destructive pr-10" : ""}
                aria-invalid={!!documentInput.error}
                aria-describedby={documentInput.error ? "documento-error documento-hint" : "documento-hint"}
                aria-required="true"
                aria-label="Documento de identificação do visitante"
                inputMode="numeric"
              />
              {documentInput.error && (
                <AlertCircle 
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" 
                  aria-hidden="true"
                />
              )}
            </div>
            <p id="documento-hint" className="text-xs text-muted-foreground sr-only">
              Digite CPF com 11 dígitos ou RG com 9 dígitos. A formatação será aplicada automaticamente.
            </p>
            {documentInput.error && (
              <p id="documento-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {documentInput.error}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="destino">Destino da Visita *</Label>
            <Select
              value={destino}
              onValueChange={(value) => {
                setDestino(value);
                if (destinoTouched) {
                  setDestinoError(null);
                }
              }}
              required
              disabled={isSubmitting}
            >
              <SelectTrigger 
                ref={destinoRef}
                id="destino"
                name="destino"
                className={destinoError ? "w-full border-destructive focus:ring-destructive" : "w-full"}
                aria-invalid={!!destinoError}
                aria-describedby={destinoError ? "destino-error destino-hint" : "destino-hint"}
                aria-required="true"
                aria-label="Destino da visita"
              >
                <SelectValue placeholder="Selecione o destino" />
              </SelectTrigger>
              <SelectContent aria-label="Lista de destinos disponíveis">
                <SelectGroup>
                  <SelectLabel>Apartamentos</SelectLabel>
                  {DESTINATIONS.filter(d => d.category === "apartment").map((dest) => (
                    <SelectItem key={dest.value} value={dest.label}>
                      {dest.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                
                <SelectGroup>
                  <SelectLabel>Áreas Comuns</SelectLabel>
                  {DESTINATIONS.filter(d => d.category === "common_area").map((dest) => (
                    <SelectItem key={dest.value} value={dest.label}>
                      {dest.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                
                <SelectGroup>
                  <SelectLabel>Administração</SelectLabel>
                  {DESTINATIONS.filter(d => d.category === "admin").map((dest) => (
                    <SelectItem key={dest.value} value={dest.label}>
                      {dest.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p id="destino-hint" className="text-xs text-muted-foreground sr-only">
              Selecione o apartamento ou área comum que o visitante irá visitar.
            </p>
            {destinoError && (
              <p id="destino-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {destinoError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo da Visita</Label>
            <Textarea
              id="motivo"
              name="motivo"
              placeholder="Descreva o motivo da visita (opcional)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              disabled={isSubmitting}
              aria-label="Motivo da visita (opcional)"
              aria-describedby="motivo-hint"
            />
            <p id="motivo-hint" className="text-xs text-muted-foreground sr-only">
              Campo opcional. Descreva brevemente o motivo da visita.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-accent hover:bg-accent-dark text-accent-foreground font-semibold"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Registrando entrada do visitante" : "Confirmar entrada do visitante"}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                Registrando...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" aria-hidden="true" />
                Confirmar Entrada
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
