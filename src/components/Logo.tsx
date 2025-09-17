import { Shield } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className = "", showText = true }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="bg-gradient-to-br from-primary to-primary-dark p-2.5 rounded-xl">
        <Shield className="h-6 w-6 text-primary-foreground" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary tracking-tight">SIGECO</span>
          <span className="text-sm text-muted-foreground -mt-1">Sistema de Gerenciamento</span>
        </div>
      )}
    </div>
  );
};