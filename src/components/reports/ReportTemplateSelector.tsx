import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReportTemplateService, type ReportTemplate } from "@/services/ReportTemplateService";
import { Check, Eye, FileText, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportTemplateSelectorProps {
  onTemplateSelect?: (template: ReportTemplate) => void;
}

export const ReportTemplateSelector = ({ onTemplateSelect }: ReportTemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>(
    ReportTemplateService.getCurrentTemplate()
  );
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const templates = ReportTemplateService.getTemplates();

  const handleTemplateSelect = (templateId: string) => {
    const template = ReportTemplateService.getTemplate(templateId);
    if (template) {
      setSelectedTemplate(template);
      ReportTemplateService.setCurrentTemplate(templateId);
      
      if (onTemplateSelect) {
        onTemplateSelect(template);
      }

      toast({
        title: "Template selecionado",
        description: `Template "${template.name}" será usado para gerar os relatórios`,
      });
    }
  };

  const handleSaveAndClose = () => {
    setIsOpen(false);
    toast({
      title: "Configuração salva",
      description: "Suas preferências de template foram salvas",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary text-primary">
          <Palette className="h-4 w-4 mr-2" />
          Selecionar Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Selecionar Template de Relatório
          </DialogTitle>
          <DialogDescription>
            Escolha um template para personalizar a aparência dos seus relatórios PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Template Atual:</p>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
              {selectedTemplate.name}
            </Badge>
          </div>

          <RadioGroup
            value={selectedTemplate.id}
            onValueChange={handleTemplateSelect}
            className="space-y-4"
          >
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate.id === template.id 
                    ? 'border-primary border-2 bg-primary/5' 
                    : 'border-border'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <RadioGroupItem value={template.id} id={template.id} />
                      <div className="flex-1">
                        <Label htmlFor={template.id} className="cursor-pointer">
                          <CardTitle className="text-base flex items-center gap-2">
                            {template.name}
                            {selectedTemplate.id === template.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </CardTitle>
                        </Label>
                        <CardDescription className="mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cor do cabeçalho:</span>
                        <div 
                          className="w-6 h-6 rounded border border-border"
                          style={{ backgroundColor: template.headerColor }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cor de destaque:</span>
                        <div 
                          className="w-6 h-6 rounded border border-border"
                          style={{ backgroundColor: template.accentColor }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Estilo da tabela:</span>
                        <Badge variant="outline" className="capitalize">
                          {template.tableStyle}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tamanho da fonte:</span>
                        <Badge variant="outline" className="capitalize">
                          {template.fontSize === 'small' ? 'Pequena' : 
                           template.fontSize === 'medium' ? 'Média' : 'Grande'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Estatísticas:</span>
                        <Badge variant={template.showStatistics ? "default" : "secondary"}>
                          {template.showStatistics ? 'Sim' : 'Não'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Numeração de páginas:</span>
                        <Badge variant={template.showPageNumbers ? "default" : "secondary"}>
                          {template.showPageNumbers ? 'Sim' : 'Não'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveAndClose} className="bg-success hover:bg-success/90">
            Salvar e Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
