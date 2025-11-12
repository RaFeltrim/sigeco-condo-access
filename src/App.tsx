import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AnalyticsService, ConsoleAnalyticsProvider, CustomAnalyticsProvider } from "@/services/AnalyticsService";
import { useUserActivityLogger } from "@/hooks/useUserActivityLogger";
import { ActivityLoggerIndicator } from "@/components/ActivityLoggerIndicator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Eager load critical pages
import Index from "./pages/Index";
import Login from "./pages/Login";

// Lazy load other pages for code splitting
const PorteiroDashboard = lazy(() => import("./pages/PorteiroDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AgendamentoPage = lazy(() => import("./pages/AgendamentoPage"));
const ControleInsumosPage = lazy(() => import("./pages/ControleInsumosPage"));
const GerenciamentoMoradoresPage = lazy(() => import("./pages/GerenciamentoMoradoresPage"));
const RelatoriosPage = lazy(() => import("./pages/RelatoriosPage"));
const SegurancaPage = lazy(() => import("./pages/SegurancaPage"));
const SuporteAvancadoPage = lazy(() => import("./pages/SuporteAvancadoPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" text="Carregando página..." />
  </div>
);

const AppContent = () => {
  // Inicializar user activity logger (apenas em dev)
  useUserActivityLogger();

  return (
    <>
      <Suspense fallback={<PageLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/porteiro-dashboard" element={<PorteiroDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/agendamento" element={<AgendamentoPage />} />
          <Route path="/controle-insumos" element={<ControleInsumosPage />} />
          <Route path="/gerenciamento-moradores" element={<GerenciamentoMoradoresPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/seguranca" element={<SegurancaPage />} />
          <Route path="/suporte-avancado" element={<SuporteAvancadoPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {/* Indicador de logging ativo */}
      <ActivityLoggerIndicator />
    </>
  );
};

const App = () => {
  useEffect(() => {
    // Initialize analytics providers
    if (import.meta.env.DEV) {
      AnalyticsService.registerProvider(new ConsoleAnalyticsProvider());
    }
    
    // Register custom provider for production
    AnalyticsService.registerProvider(new CustomAnalyticsProvider());
    
    // Track app initialization
    AnalyticsService.track('app_initialized', {
      environment: import.meta.env.MODE,
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <ErrorBoundary context="Global Application">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
