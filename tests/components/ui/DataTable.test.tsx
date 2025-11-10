import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

interface DataTableProps {
  data: Array<Record<string, unknown>>;
  columns: Array<{ key: string; label: string }>;
  onRowClick?: (row: Record<string, unknown>) => void;
}

const DataTable = ({ data, columns, onRowClick }: DataTableProps) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} onClick={() => onRowClick?.(row)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
            {columns.map(col => (
              <td key={col.key}>{String(row[col.key] || '')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

describe('DataTable', () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
  ];

  const data = [
    { name: 'João', status: 'Active' },
    { name: 'Maria', status: 'Inactive' },
  ];

  it('renders table headers', () => {
    render(<DataTable data={data} columns={columns} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders table data', () => {
    render(<DataTable data={data} columns={columns} />);
    
    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<DataTable data={[]} columns={columns} />);
    
    const tbody = screen.getByRole('table').querySelector('tbody');
    expect(tbody?.children.length).toBe(0);
  });

  it('calls onRowClick when row is clicked', () => {
    const handleRowClick = vi.fn();
    render(<DataTable data={data} columns={columns} onRowClick={handleRowClick} />);
    
    const firstRow = screen.getByText('João').closest('tr');
    firstRow?.click();

    expect(handleRowClick).toHaveBeenCalledWith(data[0]);
  });

  it('renders multiple rows', () => {
    render(<DataTable data={data} columns={columns} />);
    
    const tbody = screen.getByRole('table').querySelector('tbody');
    expect(tbody?.children.length).toBe(2);
  });
});
