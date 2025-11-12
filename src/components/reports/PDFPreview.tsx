import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReportTemplateService, type ReportTemplate } from "@/services/ReportTemplateService";
import type { ReportData } from "@/services/ReportService";
import { Eye, ZoomIn, ZoomOut, Download, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFPreviewProps {
  data: ReportData;
  template?: ReportTemplate;
  isOpen: boolean;
  onClose: () => void;
}

export const PDFPreview = ({ data, template, isOpen, onClose }: PDFPreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const { toast } = useToast();

  const generatePreview = async () => {
    setIsLoading(true);
    try {
      const activeTemplate = template || ReportTemplateService.getCurrentTemplate();
      const url = await ReportTemplateService.generatePreview(data, activeTemplate);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: "Erro ao gerar preview",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generatePreview();
    }

    // Cleanup URL when dialog closes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, template]);

  const handleDownload = async () => {
    try {
      const activeTemplate = template || ReportTemplateService.getCurrentTemplate();
      const blob = await ReportTemplateService.generatePDFWithTemplate(data, activeTemplate);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_preview_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download concluído",
        description: "O relatório foi baixado com sucesso",
      });
    } catch (error) {
      console.error('Error downloading preview:', error);
      toast({
        title: "Erro ao baixar",
        description: "Não foi possível baixar o relatório",
        variant: "destructive"
      });
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview do Relatório PDF
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Visualização do relatório antes de fazer o download
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between py-2 border-t border-b">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Template: {(template || ReportTemplateService.getCurrentTemplate()).name}
            </Badge>
            <Badge variant="outline">
              {data.registros.length} registro(s)
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-md px-2 py-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium min-w-[3rem] text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetZoom}
              disabled={zoom === 100}
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="bg-success hover:bg-success/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20 rounded-md p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Gerando preview do PDF...</p>
            </div>
          ) : previewUrl ? (
            <div 
              className="mx-auto bg-white shadow-lg" 
              style={{ 
                width: `${zoom}%`,
                transition: 'width 0.2s ease'
              }}
            >
              <iframe
                src={previewUrl}
                className="w-full h-[600px] border-0"
                title="PDF Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                Nenhum preview disponível
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Preview Button Component for easy integration
interface PDFPreviewButtonProps {
  data: ReportData;
  template?: ReportTemplate;
  children?: React.ReactNode;
}

export const PDFPreviewButton = ({ data, template, children }: PDFPreviewButtonProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsPreviewOpen(true)}
        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
      >
        <Eye className="h-4 w-4 mr-2" />
        {children || "Visualizar Preview"}
      </Button>

      <PDFPreview
        data={data}
        template={template}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};
