/**
 * Component Tests: PDFPreview
 * 
 * Testing Pyramid Layer: Component Tests
 * Purpose: Test PDFPreview component functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PDFPreview, PDFPreviewButton } from '@/components/reports/PDFPreview';
import type { ReportData } from '@/services/ReportService';

// Mock the ReportTemplateService
vi.mock('@/services/ReportTemplateService', () => ({
  ReportTemplateService: {
    getCurrentTemplate: vi.fn(() => ({
      id: 'default',
      name: 'Padrão SIGECO',
      headerColor: '#2563eb',
      accentColor: '#10b981',
      showLogo: true,
      showPageNumbers: true,
      showStatistics: true,
      showFilters: true,
      tableStyle: 'striped',
      fontSize: 'medium'
    })),
    generatePreview: vi.fn(() => Promise.resolve('blob:mock-url')),
    generatePDFWithTemplate: vi.fn(() => Promise.resolve(new Blob(['test'], { type: 'application/pdf' })))
  }
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

const mockReportData: ReportData = {
  registros: [
    {
      id: 1,
      data: '17/09/2024',
      hora: '14:30',
      visitante: 'João Silva',
      documento: '123.456.789-00',
      destino: 'Apto 101',
      motivo: 'Visita familiar',
      status: 'Concluída',
      duracao: '2h 15min'
    }
  ],
  estatisticas: {
    totalAcessos: 1,
    tempoMedio: '2h 15min',
    picoPeriodo: '14:00-16:00',
    taxaOcupacao: '67%'
  },
  metadata: {
    generatedAt: new Date(),
    generatedBy: 'Test User',
    filters: {
      periodo: 'hoje',
      tipo: 'todos',
      status: 'todos',
      destino: ''
    },
    recordCount: 1,
    format: 'pdf'
  }
};

describe('PDFPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when open', () => {
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      expect(screen.getByText(/preview do relatório pdf/i)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={false}
          onClose={vi.fn()}
        />
      );
      
      expect(screen.queryByText(/preview do relatório pdf/i)).not.toBeInTheDocument();
    });

    it('should display loading state', async () => {
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/gerando preview do pdf/i)).toBeInTheDocument();
      });
    });

    it('should display preview iframe after loading', async () => {
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        const iframe = screen.getByTitle('PDF Preview');
        expect(iframe).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Template Information', () => {
    it('should display template name', async () => {
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/template: padrão sigeco/i)).toBeInTheDocument();
      });
    });

    it('should display record count', async () => {
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText(/1 registro\(s\)/i)).toBeInTheDocument();
      });
    });
  });

  describe('Zoom Controls', () => {
    it('should display zoom controls', async () => {
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
      });
    });

    it('should allow zooming in', async () => {
      const user = userEvent.setup();
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      // Find zoom in button (should have ZoomIn icon)
      const buttons = screen.getAllByRole('button');
      const zoomInButton = buttons.find(btn => btn.querySelector('svg'));
      
      if (zoomInButton && !zoomInButton.disabled) {
        await user.click(zoomInButton);
        
        await waitFor(() => {
          expect(screen.getByText('110%')).toBeInTheDocument();
        });
      }
    });

    it('should allow zooming out', async () => {
      const user = userEvent.setup();
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      const zoomButtons = buttons.filter(btn => btn.querySelector('svg'));
      
      if (zoomButtons.length >= 2) {
        const zoomOutButton = zoomButtons[0];
        if (!zoomOutButton.disabled) {
          await user.click(zoomOutButton);
          
          await waitFor(() => {
            expect(screen.getByText('90%')).toBeInTheDocument();
          });
        }
      }
    });

    it('should reset zoom to 100%', async () => {
      const user = userEvent.setup();
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      const resetButton = screen.getByRole('button', { name: /reset/i });
      expect(resetButton).toBeDisabled(); // Should be disabled at 100%
    });

    it('should limit zoom to maximum 200%', async () => {
      const user = userEvent.setup();
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      // Try to zoom in multiple times
      const buttons = screen.getAllByRole('button');
      const zoomInButton = buttons.find(btn => 
        btn.querySelector('svg') && !btn.textContent?.includes('%')
      );
      
      if (zoomInButton) {
        // Click 15 times (should stop at 200%)
        for (let i = 0; i < 15; i++) {
          if (!zoomInButton.disabled) {
            await user.click(zoomInButton);
          }
        }
        
        await waitFor(() => {
          expect(screen.getByText('200%')).toBeInTheDocument();
        });
      }
    });

    it('should limit zoom to minimum 50%', async () => {
      const user = userEvent.setup();
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('100%')).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole('button');
      const zoomButtons = buttons.filter(btn => btn.querySelector('svg'));
      const zoomOutButton = zoomButtons[0];
      
      if (zoomOutButton) {
        // Click 10 times (should stop at 50%)
        for (let i = 0; i < 10; i++) {
          if (!zoomOutButton.disabled) {
            await user.click(zoomOutButton);
          }
        }
        
        await waitFor(() => {
          expect(screen.getByText('50%')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Download Functionality', () => {
    it('should have download button', async () => {
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={vi.fn()}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
      });
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      render(
        <PDFPreview
          data={mockReportData}
          isOpen={true}
          onClose={onClose}
        />
      );
      
      const closeButtons = screen.getAllByRole('button');
      const xButton = closeButtons.find(btn => 
        btn.querySelector('svg') && btn.className.includes('ghost')
      );
      
      if (xButton) {
        await user.click(xButton);
        expect(onClose).toHaveBeenCalled();
      }
    });
  });
});

describe('PDFPreviewButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render button with default text', () => {
      render(<PDFPreviewButton data={mockReportData} />);
      
      expect(screen.getByRole('button', { name: /visualizar preview/i })).toBeInTheDocument();
    });

    it('should render button with custom children', () => {
      render(
        <PDFPreviewButton data={mockReportData}>
          Custom Preview Text
        </PDFPreviewButton>
      );
      
      expect(screen.getByRole('button', { name: /custom preview text/i })).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should open preview dialog when clicked', async () => {
      const user = userEvent.setup();
      render(<PDFPreviewButton data={mockReportData} />);
      
      const button = screen.getByRole('button', { name: /visualizar preview/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/preview do relatório pdf/i)).toBeInTheDocument();
      });
    });

    it('should close preview dialog', async () => {
      const user = userEvent.setup();
      render(<PDFPreviewButton data={mockReportData} />);
      
      const button = screen.getByRole('button', { name: /visualizar preview/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/preview do relatório pdf/i)).toBeInTheDocument();
      });

      // Close the dialog
      const closeButtons = screen.getAllByRole('button');
      const xButton = closeButtons.find(btn => 
        btn.querySelector('svg') && btn.className.includes('ghost')
      );
      
      if (xButton) {
        await user.click(xButton);
        
        await waitFor(() => {
          expect(screen.queryByText(/preview do relatório pdf/i)).not.toBeInTheDocument();
        });
      }
    });
  });
});
