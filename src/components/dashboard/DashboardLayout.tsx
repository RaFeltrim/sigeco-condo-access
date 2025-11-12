import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface DashboardWidget {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  span?: 'full' | 'half' | 'third' | 'two-thirds';
}

interface DashboardLayoutProps {
  children?: ReactNode;
  widgets?: DashboardWidget[];
  className?: string;
  tabs?: {
    id: string;
    label: string;
    content: ReactNode;
  }[];
}

export const DashboardLayout = ({ 
  children, 
  widgets, 
  className = "",
  tabs 
}: DashboardLayoutProps) => {
  // Helper function to get grid span class
  const getSpanClass = (span?: string) => {
    switch (span) {
      case 'full':
        return 'col-span-full';
      case 'half':
        return 'lg:col-span-6';
      case 'third':
        return 'lg:col-span-4';
      case 'two-thirds':
        return 'lg:col-span-8';
      default:
        return 'lg:col-span-6';
    }
  };

  if (tabs && tabs.length > 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Tabs defaultValue={tabs[0].id} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  if (widgets && widgets.length > 0) {
    return (
      <div className={`grid gap-4 md:grid-cols-12 ${className}`}>
        {widgets.map((widget) => (
          <Card key={widget.id} className={getSpanClass(widget.span)}>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
              {widget.description && (
                <CardDescription>{widget.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {widget.content}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {children}
    </div>
  );
};

export default DashboardLayout;
