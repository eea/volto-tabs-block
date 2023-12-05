import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Edit Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Should be able to press different keys and select multiple blocks', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Tabs block default template');
    cy.get('.documentFirstHeading').contains('Tabs block default template');

    cy.getSlate().click().type('/tabs{enter}');
    cy.get('.tabs-block.edit .block-editor-slate')
      .click()
      .type('Tab 1 text{enter}');
    cy.get('.block.tabs_block legend').click();

    cy.get('.tabs-block .addition-button').click();
    cy.get('.tabs-block.edit .block-editor-slate')
      .click()
      .type('Tab 2 text{enter}');
    cy.getSlate().click().type('/tabs{enter}');
    cy.get('#toolbar-save').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    cy.contains('Tab 1');
    cy.contains('Tab 1 text');
    cy.get('.styled-tabs_block').contains('Tab 2').type('{uparrow}');
    cy.contains('Tab 2 text');
    cy.get('.edit').click();

    cy.wait(500);

    cy.get('.item').contains('Tab 2').type('{uparrow}');
    cy.get('.item').contains('Tab 1').type('{downarrow}');
    cy.get('.item').contains('Tab 2').type('{enter}');
    cy.get('.block-editor-tabs_block').first().click({ shiftKey: true });
    cy.get('.block-editor-tabs_block').last().click({ shiftKey: true });
  });
});
