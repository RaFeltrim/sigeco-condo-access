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
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden shadow-lg border-0 bg-card/95 backdrop-blur z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary">Notificações</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Marcar todas
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
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
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        {getIcon(notification.type)}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {notification.timestamp.toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
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
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default NotificationSystem;