import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter } from "lucide-react";

export const FiltersSkeleton = () => {
  return (
    <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-primary">
          <Filter className="h-5 w-5" />
          Filtros de Relatório
        </CardTitle>
        <CardDescription>Configure os parâmetros para gerar relatórios personalizados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
      </CardContent>
    </Card>
  );
};
