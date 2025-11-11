/**
 * VisitorCard Component
 * Card display for visitor information
 */

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Visitor } from '@/types/visitor';
import { User, Clock, MapPin, FileText, LogOut } from 'lucide-react';

interface VisitorCardProps {
  visitor: Visitor;
  onCheckout?: (visitor: Visitor) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const VisitorCard = ({ 
  visitor, 
  onCheckout, 
  showActions = true,
  compact = false 
}: VisitorCardProps) => {
  const isActive = visitor.status === 'Ativo';

  const getDuration = () => {
    if (!visitor.duracao) return null;
    
    const { hours, minutes } = visitor.duracao;
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  if (compact) {
    return (
      <Card className={`hover:shadow-md transition-shadow ${!isActive ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isActive ? 'bg-success/10' : 'bg-muted'}`}>
                <User className={`h-4 w-4 ${isActive ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-semibold">{visitor.nome}</p>
                <p className="text-xs text-muted-foreground">{visitor.documento}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-success' : ''}>
                {visitor.status}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">{visitor.hora}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${!isActive ? 'opacity-75' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-lg ${isActive ? 'bg-success/10' : 'bg-muted'}`}>
              <User className={`h-6 w-6 ${isActive ? 'text-success' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{visitor.nome}</h3>
              <p className="text-sm text-muted-foreground">{visitor.documento}</p>
            </div>
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-success' : ''}>
            {visitor.status}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Destino:</span>
            <span className="font-medium">{visitor.destino}</span>
          </div>

          {visitor.motivo && (
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span className="text-muted-foreground">Motivo:</span>
              <span className="font-medium flex-1">{visitor.motivo}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Entrada:</span>
            <span className="font-medium">{visitor.hora}</span>
          </div>

          {!isActive && visitor.duracao && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Duração:</span>
              <span className="font-medium">{getDuration()}</span>
            </div>
          )}
        </div>

        {showActions && isActive && onCheckout && (
          <div className="mt-4 pt-4 border-t">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => onCheckout(visitor)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Registrar Saída
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VisitorCard;
