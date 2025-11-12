import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validatePhone, validateDocument } from "@/lib/utils/validation";
import * as XLSX from 'xlsx';

interface ImportedMorador {
  nome: string;
  email: string;
  telefone: string;
  unidade: string;
  documento: string;
  tipo: string;
  status?: string;
  rowNumber: number;
  errors: string[];
  warnings: string[];
}

interface ImportDialogProps {
  onImportComplete?: (data: ImportedMorador[]) => void;
}

export const ImportDialog = ({ onImportComplete }: ImportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<ImportedMorador[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const validateRow = (row: any, rowNumber: number): ImportedMorador => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!row.nome || row.nome.trim() === '') {
      errors.push('Nome é obrigatório');
    }
    if (!row.email || row.email.trim() === '') {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push('Email inválido');
    }
    if (!row.documento || row.documento.trim() === '') {
      errors.push('Documento é obrigatório');
    } else {
      const docValidation = validateDocument(row.documento);
      if (!docValidation.isValid) {
        errors.push(docValidation.message || 'Documento inválido');
      }
    }
    if (!row.unidade || row.unidade.trim() === '') {
      errors.push('Unidade é obrigatória');
    }

    // Optional but validated fields
    if (row.telefone && !validatePhone(row.telefone)) {
      errors.push('Telefone inválido');
    }

    // Type validation
    if (row.tipo && !['Proprietário', 'Locatário'].includes(row.tipo)) {
      warnings.push(`Tipo "${row.tipo}" desconhecido. Será usado "Proprietário" como padrão`);
    }

    // Status validation
    if (row.status && !['Ativo', 'Inativo'].includes(row.status)) {
      warnings.push(`Status "${row.status}" desconhecido. Será usado "Ativo" como padrão`);
    }

    return {
      nome: row.nome || '',
      email: row.email || '',
      telefone: row.telefone || '',
      unidade: row.unidade || '',
      documento: row.documento || '',
      tipo: row.tipo || 'Proprietário',
      status: row.status || 'Ativo',
      rowNumber,
      errors,
      warnings
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx?|csv)$/i)) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo Excel (.xlsx, .xls) ou CSV (.csv)",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const validatedData = jsonData.map((row, index) => 
        validateRow(row, index + 2) // +2 because row 1 is header, and Excel is 1-indexed
      );

      setImportedData(validatedData);
      setShowPreview(true);

      const errorCount = validatedData.filter(row => row.errors.length > 0).length;
      const warningCount = validatedData.filter(row => row.warnings.length > 0).length;

      toast({
        title: "Arquivo processado",
        description: `${validatedData.length} registros encontrados. ${errorCount} erro(s), ${warningCount} aviso(s)`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Erro ao processar arquivo",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    const validRows = importedData.filter(row => row.errors.length === 0);
    
    if (validRows.length === 0) {
      toast({
        title: "Nenhum registro válido",
        description: "Corrija os erros antes de importar",
        variant: "destructive"
      });
      return;
    }

    if (onImportComplete) {
      onImportComplete(validRows);
    }

    toast({
      title: "Importação concluída",
      description: `${validRows.length} morador(es) foram importados com sucesso`,
    });

    // Reset state
    setIsOpen(false);
    setFile(null);
    setImportedData([]);
    setShowPreview(false);
  };

  const downloadTemplate = () => {
    const template = [
      {
        nome: 'João Silva',
        email: 'joao@email.com',
        telefone: '(11) 99999-9999',
        unidade: 'Apto 101',
        documento: '123.456.789-00',
        tipo: 'Proprietário',
        status: 'Ativo'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Moradores");
    XLSX.writeFile(workbook, "template_moradores.xlsx");

    toast({
      title: "Template baixado",
      description: "Use este arquivo como base para importação",
    });
  };

  const validCount = importedData.filter(row => row.errors.length === 0).length;
  const errorCount = importedData.filter(row => row.errors.length > 0).length;
  const warningCount = importedData.filter(row => row.warnings.length > 0 && row.errors.length === 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary text-primary">
          <Upload className="h-4 w-4 mr-2" />
          Importar Dados
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Importar Moradores</DialogTitle>
          <DialogDescription>
            Importe múltiplos moradores de uma vez usando um arquivo Excel ou CSV
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-4 py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p className="mb-2">O arquivo deve conter as seguintes colunas:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>nome</strong> - Nome completo (obrigatório)</li>
                  <li><strong>email</strong> - Email válido (obrigatório)</li>
                  <li><strong>telefone</strong> - Telefone no formato (11) 99999-9999</li>
                  <li><strong>unidade</strong> - Unidade/Apartamento (obrigatório)</li>
                  <li><strong>documento</strong> - CPF ou RG (obrigatório)</li>
                  <li><strong>tipo</strong> - Proprietário ou Locatário (padrão: Proprietário)</li>
                  <li><strong>status</strong> - Ativo ou Inativo (padrão: Ativo)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Arquivo Excel/CSV</Label>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  {file.name}
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={downloadTemplate}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Baixar Template
              </Button>
              <Button 
                onClick={processFile} 
                disabled={!file || isProcessing}
              >
                {isProcessing ? 'Processando...' : 'Processar Arquivo'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex gap-2 mb-4">
              <Card className="flex-1 bg-success/10 border-success/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">{validCount} Válidos</p>
                      <p className="text-xs text-muted-foreground">Prontos para importar</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-destructive/10 border-destructive/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">{errorCount} Erros</p>
                      <p className="text-xs text-muted-foreground">Necessitam correção</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1 bg-warning/10 border-warning/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <div>
                      <p className="text-sm font-medium">{warningCount} Avisos</p>
                      <p className="text-xs text-muted-foreground">Valores ajustados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 overflow-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Linha</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Problemas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center">{row.rowNumber}</TableCell>
                      <TableCell>{row.nome || <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell className="text-sm">{row.email || <span className="text-muted-foreground">-</span>}</TableCell>
                      <TableCell>
                        {row.unidade ? (
                          <Badge variant="outline">{row.unidade}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.errors.length > 0 ? (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Erro
                          </Badge>
                        ) : row.warnings.length > 0 ? (
                          <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Aviso
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            OK
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          {row.errors.map((error, i) => (
                            <p key={`error-${i}`} className="text-destructive flex items-start gap-1">
                              <XCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {error}
                            </p>
                          ))}
                          {row.warnings.map((warning, i) => (
                            <p key={`warning-${i}`} className="text-warning flex items-start gap-1">
                              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {warning}
                            </p>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPreview(false);
                  setFile(null);
                  setImportedData([]);
                }}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleImport}
                disabled={validCount === 0}
                className="bg-success hover:bg-success/90"
              >
                Importar {validCount} Registro(s)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
