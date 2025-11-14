# Document Validation System

Sistema de validação e formatação de documentos brasileiros (CPF e RG) para o Dashboard do Porteiro.

## Arquivos

- `documentValidator.ts` - Validadores de CPF e RG com algoritmo oficial
- `../formatters/documentFormatter.ts` - Formatadores de máscara para CPF e RG
- `../../hooks/useDocumentInput.ts` - Custom hook que integra validação e formatação

## Funcionalidades

### 1. Validação de CPF

Valida CPF usando o algoritmo oficial brasileiro com verificação de dígitos:

```typescript
import { validateCPF } from '@/lib/validators/documentValidator';

validateCPF('111.444.777-35'); // true
validateCPF('111.444.777-36'); // false
validateCPF('111.111.111-11'); // false (todos os dígitos iguais)
```

**Algoritmo:**
1. Remove caracteres não numéricos
2. Verifica se tem exatamente 11 dígitos
3. Rejeita CPFs com todos os dígitos iguais
4. Calcula primeiro dígito verificador
5. Calcula segundo dígito verificador
6. Compara com os dígitos fornecidos

### 2. Validação de RG

Valida RG com formato básico (9 dígitos):

```typescript
import { validateRG } from '@/lib/validators/documentValidator';

validateRG('12.345.678-9'); // true
validateRG('123456789'); // true
validateRG('111.111.111-1'); // false (todos os dígitos iguais)
```

**Nota:** RG varia por estado, esta é uma validação de formato básico.

### 3. Detecção Automática de Tipo

Detecta automaticamente se o documento é CPF ou RG:

```typescript
import { detectDocumentType } from '@/lib/validators/documentValidator';

detectDocumentType('111.444.777-35'); // 'CPF'
detectDocumentType('12.345.678-9'); // 'RG'
detectDocumentType(''); // 'UNKNOWN'
```

**Lógica:**
- 0 dígitos: UNKNOWN
- 1-9 dígitos: RG
- 10-11 dígitos: CPF

### 4. Formatação de Máscaras

Aplica máscaras automaticamente durante a digitação:

```typescript
import { formatCPF, formatRG, formatDocument } from '@/lib/formatters/documentFormatter';

// CPF: 000.000.000-00
formatCPF('11144477735'); // '111.444.777-35'
formatCPF('1114447'); // '111.444.7' (parcial)

// RG: 00.000.000-0
formatRG('123456789'); // '12.345.678-9'
formatRG('12345'); // '12.345' (parcial)

// Auto-detecta tipo
formatDocument('11144477735'); // '111.444.777-35'
formatDocument('123456789'); // '12.345.678-9'
```

### 5. Custom Hook useDocumentInput

Hook completo que integra validação e formatação em tempo real:

```typescript
import { useDocumentInput } from '@/hooks/useDocumentInput';

function MyComponent() {
  const document = useDocumentInput();
  
  return (
    <div>
      <input
        value={document.formattedValue}
        onChange={(e) => document.onChange(e.target.value)}
        onBlur={document.onBlur}
      />
      {document.error && <p>{document.error}</p>}
      {document.isValid && <p>✓ {document.type} válido</p>}
    </div>
  );
}
```

**Retorno do Hook:**
```typescript
interface UseDocumentInputReturn {
  value: string;              // Valor sem formatação
  formattedValue: string;     // Valor com máscara aplicada
  type: 'CPF' | 'RG' | 'UNKNOWN';
  isValid: boolean;           // true se documento válido
  error: string | null;       // Mensagem de erro
  onChange: (value: string) => void;
  onBlur: () => void;         // Valida ao perder foco
  reset: () => void;          // Limpa o campo
}
```

**Comportamento:**
- Detecta tipo automaticamente durante digitação
- Aplica máscara em tempo real
- Valida apenas ao perder foco (onBlur)
- Limpa erro enquanto digita
- Retorna valor formatado e não formatado

## Validação Completa

Função principal que valida e retorna resultado completo:

```typescript
import { validateDocument } from '@/lib/validators/documentValidator';

const result = validateDocument('111.444.777-35');
// {
//   isValid: true,
//   type: 'CPF',
//   formatted: '111.444.777-35',
//   error: undefined
// }

const invalid = validateDocument('111.444.777-36');
// {
//   isValid: false,
//   type: 'CPF',
//   formatted: '111.444.777-36',
//   error: 'CPF inválido'
// }
```

## Mensagens de Erro

- `"Documento é obrigatório"` - Campo vazio
- `"CPF inválido"` - CPF não passa na validação
- `"RG inválido"` - RG não passa na validação
- `"Formato de documento inválido"` - Tipo desconhecido

## Exemplo de Uso Completo

```typescript
import { useDocumentInput } from '@/hooks/useDocumentInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function VisitorForm() {
  const document = useDocumentInput();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document.isValid) {
      alert('Documento inválido!');
      return;
    }
    
    // Usar document.value (sem formatação) para salvar
    console.log('Documento:', document.value);
    console.log('Tipo:', document.type);
  };
  
  return (
    <form onSubmit={handleSubmit}>
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
        />
        
        {document.error && (
          <p className="text-sm text-red-500">{document.error}</p>
        )}
        
        {document.isValid && (
          <p className="text-sm text-green-600">
            ✓ {document.type} válido
          </p>
        )}
      </div>
      
      <button type="submit">Confirmar</button>
    </form>
  );
}
```

## Testes

Execute os testes unitários:

```bash
npm run test
```

Ou execute o teste manual:

```bash
npx tsx src/lib/validators/__manual-test__.ts
```

## Requisitos Atendidos

- ✅ 1.1 - Detecção automática de tipo de documento (CPF vs RG)
- ✅ 1.2 - Formatação em tempo real com máscaras
- ✅ 1.3 - Validação de CPF com algoritmo oficial
- ✅ 1.4 - Validação de RG com formato básico
- ✅ 1.5 - Custom hook que integra tudo

## Performance

- Validação de CPF: O(1) - algoritmo linear
- Formatação: O(n) - onde n é o tamanho do input (máx 11 caracteres)
- Sem dependências externas
- Bundle size: ~4KB total
