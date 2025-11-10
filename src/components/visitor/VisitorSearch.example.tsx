/**
 * VisitorSearch Component - Usage Examples
 * 
 * This file demonstrates how to use the VisitorSearch component
 * for searching and displaying visitor information.
 */

import { VisitorSearch } from './VisitorSearch';
import type { Visitor } from '@/types/visitor';

// Example visitor data
const exampleVisitors: Visitor[] = [
  {
    id: 1,
    nome: "João Silva",
    documento: "123.456.789-00",
    destino: "Apto 101",
    hora: "14:30",
    status: "Ativo",
    entrada: new Date(),
  },
  {
    id: 2,
    nome: "Maria Santos",
    documento: "987.654.321-00",
    destino: "Apto 205",
    hora: "13:15",
    status: "Saiu",
    entrada: new Date(Date.now() - 3600000), // 1 hour ago
    saida: new Date(),
  },
  {
    id: 3,
    nome: "Carlos Lima",
    documento: "456.789.123-00",
    destino: "Apto 304",
    hora: "12:45",
    status: "Ativo",
    entrada: new Date(Date.now() - 7200000), // 2 hours ago
  },
];

/**
 * Basic Usage Example
 */
export function BasicExample() {
  return (
    <VisitorSearch 
      visitors={exampleVisitors}
    />
  );
}

/**
 * With Selection Handler Example
 */
export function WithSelectionHandlerExample() {
  const handleSelectVisitor = (visitor: Visitor) => {
    console.log('Selected visitor:', visitor);
    // You can perform additional actions here:
    // - Show a modal with more details
    // - Navigate to a detailed page
    // - Update form fields
    // - etc.
  };

  return (
    <VisitorSearch 
      visitors={exampleVisitors}
      onSelectVisitor={handleSelectVisitor}
    />
  );
}

/**
 * Search Features:
 * 
 * 1. Multi-field Search:
 *    - Search by visitor name (fuzzy match)
 *    - Search by document number (exact match)
 *    - Search by destination (partial match)
 * 
 * 2. Relevance Scoring:
 *    - Exact match: 100 points
 *    - Starts with: 80 points
 *    - Contains: 60 points
 *    - Document matches get +10 bonus
 * 
 * 3. Real-time Results:
 *    - Results update as you type
 *    - Top 10 most relevant results shown
 *    - Sorted by relevance score
 * 
 * 4. Visitor Details:
 *    - Click on a result to see full details
 *    - View visit history for the same document
 *    - See entry/exit times and status
 * 
 * 5. Empty State:
 *    - Shows "Nenhum visitante encontrado" when no matches
 *    - Clear search button to reset
 */

/**
 * Search Examples:
 * 
 * - Type "João" → Finds "João Silva" by name
 * - Type "123.456" → Finds visitor with CPF starting with 123.456
 * - Type "Apto 101" → Finds all visitors to Apto 101
 * - Type "Silva" → Finds all visitors with "Silva" in their name
 */
