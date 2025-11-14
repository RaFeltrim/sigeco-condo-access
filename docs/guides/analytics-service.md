# AnalyticsService - Sistema Resiliente de Analytics

## Visão Geral

O `AnalyticsService` é um sistema robusto de coleta de eventos de analytics para o SIGECO, projetado para funcionar mesmo quando bloqueadores de anúncios estão ativos. Implementa queue local, múltiplos providers, retry logic com exponential backoff e armazenamento local como fallback.

## Características Principais

- ✅ **Queue Local**: Eventos são enfileirados e processados em background
- ✅ **Múltiplos Providers**: Suporte para até 3 providers simultâneos
- ✅ **Retry Logic**: Exponential backoff para tentativas de reenvio
- ✅ **Fallback Local**: Armazenamento em localStorage quando todos providers falham
- ✅ **Resiliente a Bloqueadores**: Continua funcionando mesmo com adblockers ativos
- ✅ **Sanitização de Dados**: Remove automaticamente informações sensíveis
- ✅ **Monitoramento**: Taxa de sucesso e estatísticas detalhadas

## Uso Básico

### 1. Configuração Inicial

```typescript
import { 
  AnalyticsService, 
  ConsoleAnalyticsProvider,
  CustomAnalyticsProvider 
} from '@/services/AnalyticsService';

// Registrar providers (máximo 3)
AnalyticsService.registerProvider(new ConsoleAnalyticsProvider());
AnalyticsService.registerProvider(new CustomAnalyticsProvider());
```

### 2. Tracking de Eventos

```typescript
// Evento simples
AnalyticsService.track('user_login');

// Evento com propriedades
AnalyticsService.track('report_generated', {
  format: 'pdf',
  filters: { periodo: 'mensal' },
  recordCount: 150
});

// Evento de cadastro
AnalyticsService.track('visitor_registered', {
  destination: 'Apartamento 101',
  type: 'visitante'
});
```

### 3. Monitoramento

```typescript
// Obter taxa de sucesso
const successRate = AnalyticsService.getSuccessRate();
console.log(`Taxa de sucesso: ${successRate.toFixed(2)}%`);

// Obter estatísticas completas
const stats = AnalyticsService.getStats();
console.log('Estatísticas:', stats);

// Verificar tamanho da fila
const queueSize = AnalyticsService.getQueueSize();
console.log(`Eventos na fila: ${queueSize}`);
```

## Providers Disponíveis

### ConsoleAnalyticsProvider

Provider para desenvolvimento que loga eventos no console.

```typescript
import { ConsoleAnalyticsProvider } from '@/services/AnalyticsService';

const provider = new ConsoleAnalyticsProvider();
AnalyticsService.registerProvider(provider);
```

### LocalStorageAnalyticsProvider

Provider de fallback que armazena eventos em localStorage quando todos os outros falham.

```typescript
// Já incluído automaticamente como fallback
// Não precisa ser registrado manualmente
```

### CustomAnalyticsProvider

Provider customizável para integração com backend próprio.

```typescript
import { CustomAnalyticsProvider } from '@/services/AnalyticsService';

const provider = new CustomAnalyticsProvider();
AnalyticsService.registerProvider(provider);
```

## Criando Provider Customizado

```typescript
import { BaseAnalyticsProvider, AnalyticsEvent } from '@/services/AnalyticsService';

export class GoogleAnalyticsProvider extends BaseAnalyticsProvider {
  name = 'GoogleAnalytics';

  async track(event: AnalyticsEvent): Promise<boolean> {
    return this.safeTrack(async () => {
      // Implementar integração com GA4
      if (window.gtag) {
        window.gtag('event', event.name, event.properties);
      }
    });
  }

  isBlocked(): boolean {
    // Verificar se GA está bloqueado
    return typeof window.gtag === 'undefined';
  }
}
```

## Eventos Importantes para Tracking

### Login
```typescript
AnalyticsService.track('user_login', {
  userType: 'porteiro', // ou 'admin'
  timestamp: new Date().toISOString()
});
```

### Cadastro de Visitante
```typescript
AnalyticsService.track('visitor_registered', {
  destination: 'Apartamento 101',
  type: 'visitante',
  hasVehicle: false
});
```

### Geração de Relatório
```typescript
AnalyticsService.track('report_generated', {
  format: 'pdf', // ou 'excel'
  filters: {
    periodo: 'mensal',
    tipo: 'visitante'
  },
  recordCount: 150,
  generationTime: 2.5 // segundos
});
```

### Erro Capturado
```typescript
AnalyticsService.track('error_occurred', {
  component: 'RelatoriosPage',
  errorType: 'validation',
  message: 'Filtros inválidos'
});
```

## Retry Logic

O sistema implementa exponential backoff para reenvio de eventos:

- **Tentativa 1**: Imediato
- **Tentativa 2**: Após 1 segundo
- **Tentativa 3**: Após 2 segundos
- **Tentativa 4**: Após 4 segundos (máximo)

Após 3 tentativas sem sucesso, o evento é enviado para o fallback (LocalStorage).

## Armazenamento Local

### Queue de Eventos
- Armazenado em: `sigeco_analytics_queue`
- Limite: 100 eventos
- Processamento: A cada 5 segundos

### Estatísticas
- Armazenado em: `sigeco_analytics_stats`
- Métricas: total, enviados, falhas, taxa de sucesso

### Eventos Fallback
- Armazenado em: `sigeco_analytics_events`
- Limite: 500 eventos
- Usado quando todos providers falham

## Exportação de Dados

```typescript
// Exportar todos os dados de analytics
const data = AnalyticsService.exportData();
console.log(data);

// Exportar eventos do fallback
import { LocalStorageAnalyticsProvider } from '@/services/AnalyticsService';
const fallback = new LocalStorageAnalyticsProvider();
const events = fallback.exportEvents();
```

## Sanitização de Dados

O sistema automaticamente remove informações sensíveis dos eventos:

- `password` / `senha`
- `token`
- `cpf` / `rg` / `documento`
- `email`

Exemplo:
```typescript
AnalyticsService.track('form_submitted', {
  username: 'joao',
  password: '123456', // Será substituído por [REDACTED]
  cpf: '123.456.789-00' // Será substituído por [REDACTED]
});
```

## Integração com App

### App.tsx

```typescript
import { useEffect } from 'react';
import { AnalyticsService, ConsoleAnalyticsProvider } from '@/services/AnalyticsService';

function App() {
  useEffect(() => {
    // Configurar analytics na inicialização
    if (import.meta.env.DEV) {
      AnalyticsService.registerProvider(new ConsoleAnalyticsProvider());
    }
    
    // Registrar outros providers conforme necessário
    // AnalyticsService.registerProvider(new CustomAnalyticsProvider());
  }, []);

  return (
    // ... resto do app
  );
}
```

### Login.tsx

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // ... lógica de login
  
  if (loginSuccess) {
    AnalyticsService.track('user_login', {
      userType: credentials.username === 'admin' ? 'admin' : 'porteiro'
    });
  }
};
```

### RelatoriosPage.tsx

```typescript
const handleGenerateReport = async () => {
  const startTime = Date.now();
  
  try {
    // ... gerar relatório
    
    const generationTime = (Date.now() - startTime) / 1000;
    
    AnalyticsService.track('report_generated', {
      format: 'pdf',
      filters: currentFilters,
      recordCount: data.length,
      generationTime
    });
  } catch (error) {
    AnalyticsService.track('report_generation_failed', {
      format: 'pdf',
      error: error.message
    });
  }
};
```

## Monitoramento de Performance

```typescript
// Verificar taxa de sucesso periodicamente
setInterval(() => {
  const successRate = AnalyticsService.getSuccessRate();
  
  if (successRate < 80) {
    console.warn('Taxa de sucesso de analytics abaixo de 80%:', successRate);
  }
}, 60000); // A cada minuto
```

## Troubleshooting

### Eventos não estão sendo enviados

1. Verificar se providers foram registrados:
```typescript
const stats = AnalyticsService.getStats();
console.log('Stats:', stats);
```

2. Verificar se providers estão bloqueados:
```typescript
// Implementar no provider customizado
isBlocked(): boolean {
  return typeof window.myAnalytics === 'undefined';
}
```

3. Verificar queue:
```typescript
const queueSize = AnalyticsService.getQueueSize();
console.log('Queue size:', queueSize);
```

### Taxa de sucesso baixa

- Verificar se adblockers estão bloqueando providers
- Considerar usar server-side tracking
- Verificar logs do LoggingService para erros

### Queue crescendo indefinidamente

- Verificar se providers estão funcionando
- Limpar queue manualmente se necessário:
```typescript
AnalyticsService.clearQueue();
```

## Limitações

- Máximo de 3 providers simultâneos
- Queue limitada a 100 eventos
- Fallback limitado a 500 eventos
- Timeout de 3 segundos por tentativa de envio

## Próximos Passos

1. Implementar server-side tracking para contornar bloqueadores
2. Adicionar integração com Google Analytics 4
3. Adicionar integração com Mixpanel ou Amplitude
4. Implementar dashboard de monitoramento de analytics
5. Adicionar testes automatizados
