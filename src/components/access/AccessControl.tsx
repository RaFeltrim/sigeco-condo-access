/**
 * AccessControl Component
 * Main interface for access control operations
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import AccessService from '@/services/AccessService';
import { AccessStats } from '@/types/access';
import { toast } from 'sonner';

interface StatCard {
  title: string;
  value: number;
  icon: typeof Shield;
  color: string;
  bgColor: string;
}

export const AccessControl = () => {
  const [stats, setStats] = useState<AccessStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStats = () => {
    setIsLoading(true);
    try {
      const accessStats = AccessService.getAccessStats();
      setStats(accessStats);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas');
      console.error('Error loading access stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClearOldRecords = () => {
    try {
      const removed = AccessService.clearOldRecords(90);
      if (removed > 0) {
        toast.success(`${removed} registros antigos removidos`);
        loadStats();
      } else {
        toast.info('Nenhum registro antigo encontrado');
      }
    } catch (error) {
      toast.error('Erro ao limpar registros');
      console.error('Error clearing records:', error);
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  const statCards: StatCard[] = [
    {
      title: 'Total de Acessos',
      value: stats.total,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Autorizados',
      value: stats.autorizados,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Negados',
      value: stats.negados,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Pendentes',
      value: stats.pendentes,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Controle de Acesso
              </CardTitle>
              <CardDescription>
                Gerencie e monitore os acessos ao condomínio em tempo real
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadStats}
                disabled={isLoading}
              >
                Atualizar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearOldRecords}
              >
                Limpar Antigos
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    {stats.total > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {getPercentage(stat.value, stats.total)}% do total
                      </p>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Access Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Por Tipo de Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.porTipo).map(([tipo, valor]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{tipo}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {getPercentage(valor, stats.total)}%
                    </span>
                  </div>
                  <span className="font-semibold">{valor}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.porStatus).map(([status, valor]) => {
                const colors: Record<string, string> = {
                  'Autorizado': 'bg-success',
                  'Negado': 'bg-destructive',
                  'Pendente': 'bg-warning',
                  'Expirado': 'bg-muted',
                };
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors[status] || 'bg-muted'}`} />
                      <span className="text-sm">{status}</span>
                      <span className="text-sm text-muted-foreground">
                        {getPercentage(valor, stats.total)}%
                      </span>
                    </div>
                    <span className="font-semibold">{valor}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <CheckCircle className="h-6 w-6 text-success" />
              <span>Autorizar Acesso</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <span>Negar Acesso</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <AlertCircle className="h-6 w-6 text-warning" />
              <span>Alertas de Segurança</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      {stats.pendentes > 0 && (
        <Card className="border-warning">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium">Atenção: {stats.pendentes} acesso(s) pendente(s)</p>
                <p className="text-sm text-muted-foreground">
                  Existem solicitações aguardando aprovação
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccessControl;
