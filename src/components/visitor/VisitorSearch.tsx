/**
 * VisitorSearch Component
 * Displays real-time search results with visitor details and history
 */

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, FileText, Clock, MapPin, X, ChevronRight } from 'lucide-react';
import { useVisitorSearch } from '@/hooks/useVisitorSearch';
import type { Visitor } from '@/types/visitor';
import { cn } from '@/utils/cn';

export interface VisitorSearchProps {
  visitors: Visitor[];
  onSelectVisitor?: (visitor: Visitor) => void;
}

/**
 * Formats date for display
 */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
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
 * Gets match type label
 */
function getMatchTypeLabel(matchType: 'name' | 'document' | 'destination'): string {
  const labels = {
    name: 'Nome',
    document: 'Documento',
    destination: 'Destino',
  };
  return labels[matchType];
}

/**
 * VisitorSearch Component
 */
export function VisitorSearch({ visitors, onSelectVisitor }: VisitorSearchProps) {
  const { query, results, setQuery, clearSearch } = useVisitorSearch(visitors);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleSelectVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setShowDetails(true);
    onSelectVisitor?.(visitor);
  };
  
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedVisitor(null);
  };
  
  const handleClearSearch = () => {
    clearSearch();
    setShowDetails(false);
    setSelectedVisitor(null);
  };
  
  // Get visitor history (all visits by same document)
  const visitorHistory = selectedVisitor
    ? visitors.filter(v => v.documento === selectedVisitor.documento)
    : [];
  
  return (
    <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-primary">
          <Search className="h-5 w-5" />
          Consultar Visitante
        </CardTitle>
        <CardDescription>
          Busque por nome, documento ou destino
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-3" role="search">
          <div className="relative flex-1">
            <Input
              id="visitor-search"
              type="search"
              placeholder="Buscar por nome, documento ou destino..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-8"
              aria-label="Buscar visitante por nome, documento ou destino"
              aria-describedby="search-hint"
              aria-controls={query ? "search-results" : undefined}
              aria-expanded={query && results.length > 0}
              autoComplete="off"
            />
            <p id="search-hint" className="sr-only">
              Digite para buscar visitantes. Os resultados aparecerão automaticamente.
            </p>
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                aria-label="Limpar busca"
                tabIndex={0}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
          <Button 
            variant="outline" 
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            disabled={!query}
            aria-label="Buscar"
            type="button"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Buscar</span>
          </Button>
        </div>
        
        {/* Search Results */}
        {query && (
          <div className="space-y-2">
            {results.length > 0 ? (
              <div 
                id="search-results"
                className="space-y-1 max-h-80 overflow-y-auto"
                role="listbox"
                aria-label="Resultados da busca"
              >
                <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                  {results.length} {results.length === 1 ? 'visitante encontrado' : 'visitantes encontrados'}
                </div>
                {results.map(({ visitor, matchType, relevance }) => (
                  <button
                    key={visitor.id}
                    onClick={() => handleSelectVisitor(visitor)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors",
                      "hover:bg-accent/10 hover:border-accent",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                      selectedVisitor?.id === visitor.id && "bg-accent/10 border-accent"
                    )}
                    role="option"
                    aria-selected={selectedVisitor?.id === visitor.id}
                    aria-label={`${visitor.nome}, documento ${visitor.documento}, destino ${visitor.destino}, status ${visitor.status}`}
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="bg-primary/10 p-2 rounded-lg" aria-hidden="true">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{visitor.nome}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="truncate">{visitor.documento}</span>
                            <span aria-hidden="true">•</span>
                            <span className="truncate">{visitor.destino}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge variant="outline" className="text-xs">
                          {getMatchTypeLabel(matchType)}
                        </Badge>
                        <Badge
                          variant={visitor.status === "Ativo" ? "default" : "secondary"}
                          className={visitor.status === "Ativo" ? "bg-success" : ""}
                        >
                          {visitor.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-8 text-muted-foreground"
                role="status"
                aria-live="polite"
              >
                <Search className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p className="font-medium">Nenhum visitante encontrado</p>
                <p className="text-sm mt-1">Tente buscar por outro termo</p>
              </div>
            )}
          </div>
        )}
        
        {/* Visitor Details */}
        {showDetails && selectedVisitor && (
          <div 
            className="border-t pt-4 space-y-4"
            role="region"
            aria-label="Detalhes do visitante selecionado"
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary">Detalhes do Visitante</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDetails}
                className="h-8 w-8 p-0"
                aria-label="Fechar detalhes do visitante"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            
            {/* Current Visit Info */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground" id="visitor-name-label">Nome</p>
                  <p className="font-medium" aria-labelledby="visitor-name-label">{selectedVisitor.nome}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground" id="visitor-doc-label">Documento</p>
                  <p className="font-medium" aria-labelledby="visitor-doc-label">{selectedVisitor.documento}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground" id="visitor-dest-label">Destino</p>
                  <p className="font-medium" aria-labelledby="visitor-dest-label">{selectedVisitor.destino}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground" id="visitor-entry-label">Entrada</p>
                  <p className="font-medium" aria-labelledby="visitor-entry-label">
                    {formatDate(selectedVisitor.entrada)} às {formatTime(selectedVisitor.entrada)}
                  </p>
                </div>
              </div>
              
              {selectedVisitor.saida && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground" id="visitor-exit-label">Saída</p>
                    <p className="font-medium" aria-labelledby="visitor-exit-label">
                      {formatDate(selectedVisitor.saida)} às {formatTime(selectedVisitor.saida)}
                    </p>
                  </div>
                </div>
              )}
              
              {selectedVisitor.motivo && (
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground" id="visitor-reason-label">Motivo</p>
                    <p className="font-medium" aria-labelledby="visitor-reason-label">{selectedVisitor.motivo}</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Visit History */}
            {visitorHistory.length > 1 && (
              <div className="space-y-2" role="region" aria-label="Histórico de visitas">
                <h4 className="font-semibold text-sm text-primary">
                  Histórico de Visitas ({visitorHistory.length})
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto" role="list">
                  {visitorHistory
                    .sort((a, b) => new Date(b.entrada).getTime() - new Date(a.entrada).getTime())
                    .map((visit) => (
                      <div
                        key={visit.id}
                        className="p-3 bg-muted/30 rounded-lg text-sm"
                        role="listitem"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{visit.destino}</span>
                          <Badge
                            variant={visit.status === "Ativo" ? "default" : "secondary"}
                            className={cn(
                              "text-xs",
                              visit.status === "Ativo" && "bg-success"
                            )}
                            aria-label={`Status: ${visit.status}`}
                          >
                            {visit.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(visit.entrada)} às {formatTime(visit.entrada)}
                          {visit.saida && ` - ${formatTime(visit.saida)}`}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
