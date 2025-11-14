/// <reference types="cypress" />

import { Button } from '../../../../src/components/ui/button';

describe('Button Component', () => {
  it('should render with default variant', () => {
    cy.mount(<Button>Click me</Button>);
    cy.contains('Click me').should('be.visible');
  });

  it('should render with different variants', () => {
    cy.mount(
      <div>
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    );
    
    cy.contains('Default').should('be.visible');
    cy.contains('Destructive').should('be.visible');
    cy.contains('Outline').should('be.visible');
  });

  it('should render with different sizes', () => {
    cy.mount(
      <div>
        <Button size="default">Default</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">Icon</Button>
      </div>
    );
    
    cy.contains('Default').should('be.visible');
    cy.contains('Small').should('be.visible');
    cy.contains('Large').should('be.visible');
  });

  it('should be clickable', () => {
    const onClick = cy.stub();
    cy.mount(<Button onClick={onClick}>Click</Button>);
    
    cy.contains('Click').click();
    cy.wrap(onClick).should('have.been.calledOnce');
  });

  it('should be disabled', () => {
    const onClick = cy.stub();
    cy.mount(<Button disabled onClick={onClick}>Disabled</Button>);
    
    cy.contains('Disabled').should('be.disabled');
    cy.contains('Disabled').click({ force: true });
    cy.wrap(onClick).should('not.have.been.called');
  });

  it('should support asChild prop', () => {
    cy.mount(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    cy.get('a').should('have.attr', 'href', '/test');
  });
});
