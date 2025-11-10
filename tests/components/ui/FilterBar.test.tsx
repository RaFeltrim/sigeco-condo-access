import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

interface FilterBarProps {
  onFilter: (filters: Record<string, string>) => void;
}

const FilterBar = ({ onFilter }: FilterBarProps) => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div>
      <input
        placeholder="Search..."
        onChange={(e) => handleChange('search', e.target.value)}
      />
      <select onChange={(e) => handleChange('status', e.target.value)}>
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
};

import { useState } from 'react';

describe('FilterBar', () => {
  it('renders search input', () => {
    render(<FilterBar onFilter={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders status select', () => {
    render(<FilterBar onFilter={vi.fn()} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('calls onFilter when search changes', () => {
    const handleFilter = vi.fn();
    render(<FilterBar onFilter={handleFilter} />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'test' },
    });

    expect(handleFilter).toHaveBeenCalledWith({ search: 'test' });
  });

  it('calls onFilter when status changes', () => {
    const handleFilter = vi.fn();
    render(<FilterBar onFilter={handleFilter} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'active' },
    });

    expect(handleFilter).toHaveBeenCalledWith({ status: 'active' });
  });
});
