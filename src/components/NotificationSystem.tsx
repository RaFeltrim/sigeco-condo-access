import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "warning",
      title: "Agendamento pendente",
      message: "Dr. Carlos Mendes tem visita agendada para hoje às 14:00",
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      type: "info",
      title: "Novo visitante",
      message: "Ana Limpeza acabou de chegar no prédio",
      timestamp: new Date(Date.now() - 10 * 60000),
      read: false
    },
    {
      id: 3,
      type: "success",
      title: "Backup concluído",
      message: "Backup automático realizado com sucesso",
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true
    }
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle keyboard navigation for closing panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    // Simular novas notificações
    const interval = setInterval(() => {
      const newNotifications = [
        {
          type: "info" as const,
          title: "Visitante chegou",
          message: "João Silva está na portaria"
        },
        {
          type: "warning" as const,
          title: "Agendamento atrasado",
          message: "Técnico TV está 15 minutos atrasado"
        },
        {
          type: "success" as const,
          title: "Saída registrada",
          message: "Maria Santos finalizou sua visita"
        }
      ];

      if (Math.random() > 0.7) { // 30% chance de nova notificação
        const randomNotif = newNotifications[Math.floor(Math.random() * newNotifications.length)];
        const newNotif: Notification = {
          id: Date.now(),
          type: randomNotif.type,
          title: randomNotif.title,
          message: randomNotif.message,
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [newNotif, ...prev.slice(0, 9)]); // Máximo 10 notificações
        
        toast({
          title: randomNotif.title,
          description: randomNotif.message,
        });
      }
    }, 30000); // Nova notificação a cada 30 segundos

    return () => clearInterval(interval);
  }, [toast]);

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Info className="h-4 w-4 text-accent" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "border-l-success";
      case "warning": return "border-l-warning";
      case "error": return "border-l-destructive";
      default: return "border-l-accent";
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="notification-panel"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive"
            aria-label={`${unreadCount} notificações não lidas`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop overlay to close on outside click */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          <Card 
            id="notification-panel"
            className="fixed right-4 top-16 w-80 max-h-96 overflow-hidden shadow-lg border-0 bg-card/95 backdrop-blur z-[9999]"
            role="dialog"
            aria-label="Painel de notificações"
            aria-modal="false"
          >
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary" id="notification-title">Notificações</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-xs"
                    aria-label="Marcar todas as notificações como lidas"
                  >
                    Marcar todas
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fechar painel de notificações"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

          <div 
            className="max-h-80 overflow-y-auto"
            role="list"
            aria-label="Lista de notificações"
            aria-live="polite"
            aria-atomic="false"
          >
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground" role="status">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      getTypeColor(notification.type)
                    } ${!notification.read ? "bg-primary/5" : ""}`}
                    onClick={() => markAsRead(notification.id)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        markAsRead(notification.id);
                      }
                    }}
                    aria-label={`${notification.type === 'warning' ? 'Aviso' : notification.type === 'success' ? 'Sucesso' : notification.type === 'error' ? 'Erro' : 'Informação'}: ${notification.title}. ${notification.message}. ${notification.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}. ${!notification.read ? 'Não lida' : 'Lida'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <span aria-hidden="true">{getIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <time dateTime={notification.timestamp.toISOString()}>
                              {notification.timestamp.toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </time>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-destructive/10"
                        aria-label={`Remover notificação: ${notification.title}`}
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;