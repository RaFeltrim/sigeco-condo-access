/// <reference types="cypress" />

import { Input } from '../../../../src/components/ui/input';
import { Label } from '../../../../src/components/ui/label';

describe('Input Component', () => {
  it('should render input field', () => {
    cy.mount(<Input placeholder="Enter text" />);
    cy.get('input').should('exist');
    cy.get('input').should('have.attr', 'placeholder', 'Enter text');
  });

  it('should accept text input', () => {
    cy.mount(<Input />);
    cy.get('input').type('Test input');
    cy.get('input').should('have.value', 'Test input');
  });

  it('should work with Label', () => {
    cy.mount(
      <div>
        <Label htmlFor="test">Test Label</Label>
        <Input id="test" />
      </div>
    );
    
    cy.contains('Test Label').should('be.visible');
    cy.get('#test').should('exist');
  });

  it('should support different types', () => {
    cy.mount(
      <div>
        <Input type="text" data-testid="text" />
        <Input type="email" data-testid="email" />
        <Input type="password" data-testid="password" />
        <Input type="number" data-testid="number" />
      </div>
    );
    
    cy.getBySel('text').should('have.attr', 'type', 'text');
    cy.getBySel('email').should('have.attr', 'type', 'email');
    cy.getBySel('password').should('have.attr', 'type', 'password');
    cy.getBySel('number').should('have.attr', 'type', 'number');
  });

  it('should be disabled when disabled prop is true', () => {
    cy.mount(<Input disabled />);
    cy.get('input').should('be.disabled');
  });

  it('should handle onChange event', () => {
    const onChange = cy.stub();
    cy.mount(<Input onChange={onChange} />);
    
    cy.get('input').type('test');
    cy.wrap(onChange).should('have.been.called');
  });

  it('should clear input', () => {
    cy.mount(<Input value="Initial" onChange={() => {}} />);
    cy.get('input').should('have.value', 'Initial');
    cy.get('input').clear();
    cy.get('input').should('have.value', '');
  });
});
