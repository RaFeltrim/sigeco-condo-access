/**
 * E2E Test: Delete Resident (Excluir Morador)
 * 
 * Validates that the delete resident feature works with actual state management.
 */

describe('Moradores - Delete Resident', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('senha123');
    cy.get('button[type="submit"]').click();
    cy.contains('button', 'Gerenciamento de Moradores').click();
    cy.url().should('include', '/moradores');
  });

  it('should delete a resident after confirmation', () => {
    // Get initial row count
    cy.get('table tbody tr').then(($rows) => {
      const initialCount = $rows.length;

      // Find and click delete button for last resident (Carlos Pereira)
      cy.contains('tr', 'Carlos Pereira').within(() => {
        cy.get('button[aria-label*="Excluir"]').click();
      });

      // Verify confirmation dialog
      cy.contains('Confirmar Exclusão').should('be.visible');
      cy.contains('Tem certeza que deseja excluir').should('be.visible');
      cy.contains('Carlos Pereira').should('be.visible');

      // Confirm deletion
      cy.contains('button', 'Confirmar Exclusão').click();

      // Verify success toast
      cy.contains('Morador excluído').should('be.visible');
      cy.contains('Carlos Pereira foi removido do sistema').should('be.visible');

      // Verify row count decreased
      cy.get('table tbody tr').should('have.length', initialCount - 1);

      // Verify resident no longer in table
      cy.contains('tr', 'Carlos Pereira').should('not.exist');
    });
  });

  it('should cancel deletion without removing resident', () => {
    cy.get('table tbody tr').then(($rows) => {
      const initialCount = $rows.length;

      // Click delete button
      cy.contains('tr', 'Ana Silva Costa').within(() => {
        cy.get('button[aria-label*="Excluir"]').click();
      });

      // Verify confirmation dialog
      cy.contains('Confirmar Exclusão').should('be.visible');

      // Cancel
      cy.contains('button', 'Cancelar').click();

      // Verify resident still exists
      cy.contains('tr', 'Ana Silva Costa').should('exist');
      cy.get('table tbody tr').should('have.length', initialCount);
    });
  });

  it('should update statistics after deletion', () => {
    // Get initial total count
    cy.contains('Total de Moradores').parent().find('.text-3xl').invoke('text').then((initialTotal) => {
      const initialCount = parseInt(initialTotal);

      // Delete a resident
      cy.contains('tr', 'Maria Oliveira').within(() => {
        cy.get('button[aria-label*="Excluir"]').click();
      });

      cy.contains('button', 'Confirmar Exclusão').click();

      // Wait for deletion
      cy.contains('Morador excluído').should('be.visible');

      // Verify statistics updated
      cy.contains('Total de Moradores').parent().find('.text-3xl').should('have.text', String(initialCount - 1));
    });
  });

  it('should handle multiple sequential deletions', () => {
    // Delete first resident
    cy.contains('tr', 'Ana Silva Costa').within(() => {
      cy.get('button[aria-label*="Excluir"]').click();
    });
    cy.contains('button', 'Confirmar Exclusão').click();
    cy.contains('Ana Silva Costa foi removido').should('be.visible');

    // Wait for toast to disappear
    cy.wait(500);

    // Delete second resident
    cy.contains('tr', 'João Santos Lima').within(() => {
      cy.get('button[aria-label*="Excluir"]').click();
    });
    cy.contains('button', 'Confirmar Exclusão').click();
    cy.contains('João Santos Lima foi removido').should('be.visible');

    // Verify both are gone
    cy.contains('tr', 'Ana Silva Costa').should('not.exist');
    cy.contains('tr', 'João Santos Lima').should('not.exist');

    // Verify only 2 residents remain
    cy.get('table tbody tr').should('have.length', 2);
  });

  it('should show confirmation message with resident name', () => {
    const residentName = 'Maria Oliveira';

    cy.contains('tr', residentName).within(() => {
      cy.get('button[aria-label*="Excluir"]').click();
    });

    // Verify confirmation dialog contains resident name
    cy.contains('Tem certeza que deseja excluir').should('be.visible');
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains('strong', residentName).should('exist');
      cy.contains('Esta ação não pode ser desfeita').should('exist');
    });

    // Cancel to cleanup
    cy.contains('button', 'Cancelar').click();
  });
});
