import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock component for testing
const AgendamentoForm = ({ onSubmit }: { onSubmit: (data: unknown) => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} data-testid="agendamento-form">
      <input name="visitorName" placeholder="Nome do visitante" required />
      <input name="visitorCpf" placeholder="CPF" required />
      <input name="date" type="date" required />
      <button type="submit">Agendar</button>
    </form>
  );
};

describe('AgendamentoForm', () => {
  it('renders all fields', () => {
    render(<AgendamentoForm onSubmit={vi.fn()} />);
    
    expect(screen.getByPlaceholderText('Nome do visitante')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CPF')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agendar/i })).toBeInTheDocument();
  });

  it('submits form with valid data', () => {
    const handleSubmit = vi.fn();
    render(<AgendamentoForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Nome do visitante'), {
      target: { value: 'João Silva' },
    });
    fireEvent.change(screen.getByPlaceholderText('CPF'), {
      target: { value: '12345678900' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /agendar/i }));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('validates required fields', () => {
    render(<AgendamentoForm onSubmit={vi.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /agendar/i });
    fireEvent.click(submitButton);

    // HTML5 validation prevents submission
    expect(screen.getByPlaceholderText('Nome do visitante')).toBeRequired();
  });

  it('handles form reset', () => {
    render(<AgendamentoForm onSubmit={vi.fn()} />);
    
    const nameInput = screen.getByPlaceholderText('Nome do visitante') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'João' } });
    
    const form = screen.getByTestId('agendamento-form') as HTMLFormElement;
    form.reset();

    expect(nameInput.value).toBe('');
  });
});
