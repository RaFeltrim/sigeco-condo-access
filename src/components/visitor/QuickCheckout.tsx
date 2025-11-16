/**
 * QuickCheckout Component
 * DSB-004: Implements "Pronto para a Saída" functionality
 * Allows quick visitor checkout by searching and auto-filling data
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  Search, 
  User, 
  MapPin, 
  Clock, 
  X, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import type { Visitor } from '@/types/visitor';
import { cn } from '@/utils/cn';

export interface QuickCheckoutProps {
  visitors: Visitor[];
  onCheckout: (id: number) => void;
}

/**
 * Formats time for display
 */
function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * QuickCheckout Component
 */
export function QuickCheckout({ visitors, onCheckout }: QuickCheckoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filter only active visitors
  const activeVisitors = visitors.filter(v => v.status === 'Ativo');
  
  // Search active visitors
  const searchResults = searchQuery.trim()
    ? activeVisitors.filter(v => 
        v.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.documento.includes(searchQuery) ||
        v.destino.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const handleSelectVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setSearchQuery('');
  };
  
  const handleConfirmCheckout = async () => {
    if (!selectedVisitor) return;
    
    try {
      setIsProcessing(true);
      await onCheckout(selectedVisitor.id);
      setSelectedVisitor(null);
    } catch (error) {
      console.error('Quick checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancel = () => {
    setSelectedVisitor(null);
    setSearchQuery('');
  };
  
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-destructive/5 to-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-primary">
          <LogOut className="h-5 w-5" aria-hidden="true" />
          Pronto para a Saída?
        </CardTitle>
        <CardDescription>
          Busque o visitante e confirme a saída rapidamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedVisitor ? (
          <>
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Buscar visitante ativo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Buscar visitante para saída"
                autoComplete="off"
              />
            </div>
            
            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-2">
                {searchResults.length > 0 ? (
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    <div className="sr-only" role="status" aria-live="polite">
                      {searchResults.length} {searchResults.length === 1 ? 'visitante encontrado' : 'visitantes encontrados'}
                    </div>
                    {searchResults.map((visitor) => (
                      <button
                        key={visitor.id}
                        onClick={() => handleSelectVisitor(visitor)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-colors",
                          "hover:bg-accent/10 hover:border-accent",
                          "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                        )}
                        aria-label={`Selecionar ${visitor.nome} para saída`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="bg-primary/10 p-2 rounded-lg" aria-hidden="true">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{visitor.nome}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="truncate">{visitor.destino}</span>
                                <span aria-hidden="true">•</span>
                                <span>Entrada: {visitor.hora}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-success ml-2">
                            Ativo
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                    <p className="text-sm">Nenhum visitante ativo encontrado</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Active Visitors Count */}
            {!searchQuery && (
              <div className="text-center py-4 text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                <p className="text-sm">
                  {activeVisitors.length === 0 
                    ? 'Nenhum visitante ativo no momento'
                    : `${activeVisitors.length} ${activeVisitors.length === 1 ? 'visitante ativo' : 'visitantes ativos'}`
                  }
                </p>
                <p className="text-xs mt-1">Digite para buscar</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Confirmation View */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" aria-hidden="true" />
                <span className="font-semibold">Visitante Selecionado</span>
              </div>
              
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Nome</p>
                    <p className="font-semibold">{selectedVisitor.nome}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Destino</p>
                    <p className="font-medium">{selectedVisitor.destino}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Horário de Entrada</p>
                    <p className="font-medium">{formatTime(selectedVisitor.entrada)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="flex-1"
                  aria-label="Cancelar saída"
                >
                  <X className="h-4 w-4 mr-2" aria-hidden="true" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmCheckout}
                  disabled={isProcessing}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  aria-label={`Confirmar saída de ${selectedVisitor.nome}`}
                  aria-busy={isProcessing}
                >
                  <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                  {isProcessing ? 'Processando...' : 'Confirmar Saída'}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
