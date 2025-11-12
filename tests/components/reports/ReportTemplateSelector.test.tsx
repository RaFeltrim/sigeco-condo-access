/**
 * Component Tests: ReportTemplateSelector
 * 
 * Testing Pyramid Layer: Component Tests
 * Purpose: Test ReportTemplateSelector component in isolation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportTemplateSelector } from '@/components/reports/ReportTemplateSelector';
import { ReportTemplateService } from '@/services/ReportTemplateService';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('ReportTemplateSelector', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the selector button', () => {
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      expect(button).toBeInTheDocument();
    });

    it('should show dialog when button is clicked', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should display all available templates', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Padrão SIGECO')).toBeInTheDocument();
        expect(screen.getByText('Minimalista')).toBeInTheDocument();
        expect(screen.getByText('Executivo')).toBeInTheDocument();
        expect(screen.getByText('Compacto')).toBeInTheDocument();
      });
    });

    it('should show current template badge', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        const currentTemplate = ReportTemplateService.getCurrentTemplate();
        expect(screen.getByText(currentTemplate.name)).toBeInTheDocument();
      });
    });
  });

  describe('Template Selection', () => {
    it('should allow selecting a template', async () => {
      const user = userEvent.setup();
      const onTemplateSelect = vi.fn();
      render(<ReportTemplateSelector onTemplateSelect={onTemplateSelect} />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find and click the minimal template
      const minimalCard = screen.getByText('Minimalista').closest('div[role="none"]');
      if (minimalCard) {
        await user.click(minimalCard);
      }

      await waitFor(() => {
        expect(onTemplateSelect).toHaveBeenCalled();
      });
    });

    it('should highlight selected template', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        const currentTemplate = ReportTemplateService.getCurrentTemplate();
        const selectedCard = screen.getByText(currentTemplate.name).closest('.border-primary');
        expect(selectedCard).toBeInTheDocument();
      });
    });

    it('should persist template selection', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Select executive template
      const executiveText = screen.getByText('Executivo');
      const executiveCard = executiveText.closest('div[role="none"]');
      if (executiveCard) {
        await user.click(executiveCard);
      }

      // Check localStorage
      await waitFor(() => {
        const savedId = localStorage.getItem('sigeco_report_template');
        expect(savedId).toBe('executive');
      });
    });
  });

  describe('Template Details Display', () => {
    it('should display template description', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/Template padrão com todas as informações/i)).toBeInTheDocument();
        expect(screen.getByText(/Template limpo e compacto/i)).toBeInTheDocument();
      });
    });

    it('should display template colors', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getAllByText(/Cor do cabeçalho/i)).toHaveLength(4);
        expect(screen.getAllByText(/Cor de destaque/i)).toHaveLength(4);
      });
    });

    it('should display template properties', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getAllByText(/Estilo da tabela/i)).toHaveLength(4);
        expect(screen.getAllByText(/Tamanho da fonte/i)).toHaveLength(4);
        expect(screen.getAllByText(/Estatísticas/i)).toHaveLength(4);
        expect(screen.getAllByText(/Numeração de páginas/i)).toHaveLength(4);
      });
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog on cancel', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close dialog on save', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: /salvar e fechar/i });
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('radiogroup')).toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      
      // Tab to button and press Enter
      await user.tab();
      await user.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle template selection without callback', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Should not throw error when clicking template
      const minimalText = screen.getByText('Minimalista');
      const minimalCard = minimalText.closest('div[role="none"]');
      if (minimalCard) {
        await user.click(minimalCard);
      }
      
      // Should still work
      expect(ReportTemplateService.getCurrentTemplate().id).toBe('minimal');
    });

    it('should maintain selection when dialog is reopened', async () => {
      const user = userEvent.setup();
      render(<ReportTemplateSelector />);
      
      // Open and select executive
      const button = screen.getByRole('button', { name: /selecionar template/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const executiveText = screen.getByText('Executivo');
      const executiveCard = executiveText.closest('div[role="none"]');
      if (executiveCard) {
        await user.click(executiveCard);
      }

      // Close and reopen
      const saveButton = screen.getByRole('button', { name: /salvar e fechar/i });
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        const selectedCard = screen.getByText('Executivo').closest('.border-primary');
        expect(selectedCard).toBeInTheDocument();
      });
    });
  });
});
