import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface StatItem {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: string;
  description?: string;
}

interface DashboardStatsProps {
  stats: StatItem[];
  className?: string;
}

export const DashboardStats = ({ stats, className = "" }: DashboardStatsProps) => {
  const getChangeColor = (changeType?: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getChangeIcon = (change?: string, changeType?: 'positive' | 'negative' | 'neutral') => {
    if (!change) return null;
    
    const isPositive = change.startsWith('+');
    const Icon = changeType === 'negative' ? TrendingDown : TrendingUp;
    
    return <Icon className="w-3 h-3" />;
  };

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`} data-testid="stats-cards-container">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`stat-card-${index}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" data-testid={`stat-title-${index}`}>
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-value-${index}`}>{stat.value}</div>
              {stat.description && (
                <CardDescription className="text-xs mt-1">
                  {stat.description}
                </CardDescription>
              )}
              {stat.change && (
                <div className="flex items-center gap-1 mt-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getChangeColor(stat.changeType)}`}
                  >
                    {getChangeIcon(stat.change, stat.changeType)}
                    <span className="ml-1">{stat.change}</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    vs. período anterior
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
