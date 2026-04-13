import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Tabs Block: View Mode Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Tabs Block: Add and save', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Tabs View Test');
    cy.get('.documentFirstHeading').contains('Tabs View Test');

    cy.getSlate().click();

    // Add tabs block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    // Type in first tab
    cy.get('.tabs-block [contenteditable=true]').first().type('Tab content');

    // Save
    cy.get('#toolbar-save').click();
    cy.contains('Tabs View Test');
  });
});