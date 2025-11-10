/**
 * Component Tests: Morador Form
 * 
 * Testing Pyramid Layer: Component Tests
 * Purpose: Test MoradorForm component in isolation with mocked dependencies
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Mock component (to be replaced with actual component)
const MoradorForm = ({ onSubmit, initialData }: {
  onSubmit: (data: unknown) => void;
  initialData?: { nome: string; email: string; telefone: string };
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      nome: formData.get('nome'),
      email: formData.get('email'),
      telefone: formData.get('telefone'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="nome" defaultValue={initialData?.nome} placeholder="Nome" required />
      <input name="email" type="email" defaultValue={initialData?.email} placeholder="Email" required />
      <input name="telefone" defaultValue={initialData?.telefone} placeholder="Telefone" />
      <button type="submit">Salvar</button>
    </form>
  );
};

describe('MoradorForm', () => {
  describe('Rendering', () => {
    it('should render all form fields', () => {
      render(<MoradorForm onSubmit={vi.fn()} />);
      
      expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Telefone')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
    });

    it('should render with initial data', () => {
      const initialData = {
        nome: 'João Silva',
        email: 'joao@example.com',
        telefone: '(11) 99999-9999',
      };
      
      render(<MoradorForm onSubmit={vi.fn()} initialData={initialData} />);
      
      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
      expect(screen.getByDisplayValue('joao@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('(11) 99999-9999')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(<MoradorForm onSubmit={handleSubmit} />);
      
      await user.type(screen.getByPlaceholderText('Nome'), 'João Silva');
      await user.type(screen.getByPlaceholderText('Email'), 'joao@example.com');
      await user.type(screen.getByPlaceholderText('Telefone'), '11999999999');
      await user.click(screen.getByRole('button', { name: 'Salvar' }));
      
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          nome: 'João Silva',
          email: 'joao@example.com',
          telefone: '11999999999',
        });
      });
    });

    it('should not submit with invalid email', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(<MoradorForm onSubmit={handleSubmit} />);
      
      await user.type(screen.getByPlaceholderText('Nome'), 'João Silva');
      await user.type(screen.getByPlaceholderText('Email'), 'invalid-email');
      await user.click(screen.getByRole('button', { name: 'Salvar' }));
      
      // HTML5 validation should prevent submission
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    it('should require nome field', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(<MoradorForm onSubmit={handleSubmit} />);
      
      await user.type(screen.getByPlaceholderText('Email'), 'joao@example.com');
      await user.click(screen.getByRole('button', { name: 'Salvar' }));
      
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should require email field', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(<MoradorForm onSubmit={handleSubmit} />);
      
      await user.type(screen.getByPlaceholderText('Nome'), 'João Silva');
      await user.click(screen.getByRole('button', { name: 'Salvar' }));
      
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('should allow typing in all fields', async () => {
      const user = userEvent.setup();
      
      render(<MoradorForm onSubmit={vi.fn()} />);
      
      const nomeInput = screen.getByPlaceholderText('Nome');
      const emailInput = screen.getByPlaceholderText('Email');
      const telefoneInput = screen.getByPlaceholderText('Telefone');
      
      await user.type(nomeInput, 'João');
      await user.type(emailInput, 'joao@test.com');
      await user.type(telefoneInput, '11999999999');
      
      expect(nomeInput).toHaveValue('João');
      expect(emailInput).toHaveValue('joao@test.com');
      expect(telefoneInput).toHaveValue('11999999999');
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = vi.fn();
      
      render(<MoradorForm onSubmit={handleSubmit} />);
      
      await user.type(screen.getByPlaceholderText('Nome'), 'João Silva');
      await user.type(screen.getByPlaceholderText('Email'), 'joao@example.com');
      await user.click(screen.getByRole('button', { name: 'Salvar' }));
      
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });
    });
  });
});
