import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, UserMinus, Loader2 } from "lucide-react";
import type { Visitor } from "@/types/visitor";

interface VisitorListProps {
  visitors: Visitor[];
  onCheckout: (id: number) => void;
}

export function VisitorList({ visitors, onCheckout }: VisitorListProps) {
  const [checkingOutId, setCheckingOutId] = useState<number | null>(null);
  
  // Sort visitors: Active first, then by entry time (most recent first)
  const sortedVisitors = [...visitors]
    .sort((a, b) => {
      // First, sort by status: "Ativo" comes before "Saiu"
      if (a.status === "Ativo" && b.status === "Saiu") return -1;
      if (a.status === "Saiu" && b.status === "Ativo") return 1;
      
      // Within same status, sort by entry time (most recent first)
      return new Date(b.entrada).getTime() - new Date(a.entrada).getTime();
    })
    .slice(0, 10);

  const handleCheckout = async (id: number) => {
    try {
      setCheckingOutId(id);
      await onCheckout(id);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setCheckingOutId(null);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-primary">
          <Clock className="h-5 w-5" aria-hidden="true" />
          Entradas Recentes
        </CardTitle>
        <CardDescription>Últimas entradas registradas hoje</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {sortedVisitors.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground" role="status">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p>Nenhum visitante registrado</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold">Visitante</th>
                  <th className="text-left p-3 text-sm font-semibold">Destino</th>
                  <th className="text-center p-3 text-sm font-semibold">Horário</th>
                  <th className="text-center p-3 text-sm font-semibold">Status</th>
                  <th className="text-center p-3 text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedVisitors.map((registro) => (
                  <tr
                    key={registro.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg" aria-hidden="true">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-semibold text-sm">{registro.nome}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{registro.destino}</td>
                    <td className="p-3 text-center text-sm">{registro.hora}</td>
                    <td className="p-3 text-center">
                      <Badge
                        variant={registro.status === "Ativo" ? "default" : "secondary"}
                        className={registro.status === "Ativo" ? "bg-success" : "bg-gray-500"}
                        aria-label={`Status: ${registro.status}`}
                      >
                        {registro.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      {registro.status === "Ativo" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCheckout(registro.id)}
                          disabled={checkingOutId === registro.id}
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          aria-label={`Registrar saída de ${registro.nome}`}
                          aria-busy={checkingOutId === registro.id}
                        >
                          {checkingOutId === registro.id ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" aria-hidden="true" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <UserMinus className="h-3 w-3 mr-1" aria-hidden="true" />
                              Saída
                            </>
                          )}
                        </Button>
                      ) : (
                        registro.saida && (
                          <span className="text-xs text-muted-foreground">
                            {registro.saida.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
