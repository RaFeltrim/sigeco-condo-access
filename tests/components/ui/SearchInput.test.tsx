import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const SearchInput = ({ onSearch }: { onSearch: (value: string) => void }) => {
  return (
    <input
      type="search"
      placeholder="Search..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
};

describe('SearchInput', () => {
  it('renders search input', () => {
    render(<SearchInput onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('calls onSearch when value changes', () => {
    const handleSearch = vi.fn();
    render(<SearchInput onSearch={handleSearch} />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'test query' },
    });

    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  it('handles empty search', () => {
    const handleSearch = vi.fn();
    render(<SearchInput onSearch={handleSearch} />);

    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: '' },
    });

    expect(handleSearch).toHaveBeenCalledWith('');
  });
});
