import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsService } from "@/services/AnalyticsService";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      if (credentials.username && credentials.password) {
        const userType = credentials.username === "admin" ? "admin" : "porteiro";
        
        // Track successful login
        AnalyticsService.track('user_login', {
          userType,
          timestamp: new Date().toISOString()
        });
        
        if (credentials.username === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/porteiro-dashboard");
        }
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo(a), ${credentials.username}!`,
        });
      } else {
        // Track failed login
        AnalyticsService.track('login_failed', {
          reason: 'missing_credentials',
          timestamp: new Date().toISOString()
        });
        
        toast({
          title: "Erro no login",
          description: "Usuário e senha são obrigatórios.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-background to-muted p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Acesso ao Sistema</CardTitle>
          <CardDescription className="text-muted-foreground">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-accent hover:bg-accent-dark text-accent-foreground font-semibold transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center">
              <Button 
                type="button"
                variant="link" 
                className="text-sm text-muted-foreground hover:text-primary"
                onClick={() => toast({ title: "Funcionalidade em desenvolvimento" })}
              >
                Esqueceu sua senha?
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-xs text-center text-muted-foreground">
              <p>Usuários de teste:</p>
              <p><strong>admin</strong> - Acesso Administrador</p>
              <p><strong>porteiro</strong> - Acesso Porteiro</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;