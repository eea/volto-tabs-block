import { slateBeforeEach, slateAfterEach } from '../support/e2e';

const setPageTitle = (title) => {
  cy.clearSlateTitle();
  cy.getSlateTitle().type(title);
  cy.get('.documentFirstHeading').contains(title);
};

const addTabsBlock = () => {
  cy.getSlate().click();
  cy.get('.ui.basic.icon.button.block-add-button').first().click();
  cy.get('.blocks-chooser .title').contains('Common').click();
  cy.get('.content.active.common .button.tabs_block')
    .contains('Tabs')
    .click({ force: true });
};

const typeActiveTabContent = (text) => {
  cy.get('.tabs-block.edit [contenteditable=true]')
    .first()
    .focus()
    .click({ force: true })
    .type(text);
};

const addSecondTabWithContent = (text) => {
  cy.get('.tabs-block .addition-button').click({ force: true });
  typeActiveTabContent(text);
};

const saveAndAssertViewUrl = () => {
  cy.get('#toolbar-save').click();
  cy.url().should('eq', `${Cypress.config().baseUrl}/cypress/my-page`);
};

const getViewTabItem = (label) => {
  return cy.contains('.tabs-block .menu-item-text', label).closest('.item');
};

describe('Tabs Block: View Mode Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('persists tab content after edit-view-edit cycles', () => {
    setPageTitle('Tabs View Persistence');
    addTabsBlock();

    typeActiveTabContent('First tab content');
    addSecondTabWithContent('Second tab content');

    saveAndAssertViewUrl();

    getViewTabItem('Tab 1').should('have.class', 'active');
    cy.get('#page-document .tabs-block').should('contain', 'First tab content');

    getViewTabItem('Tab 2').click();
    getViewTabItem('Tab 2').should('have.class', 'active');
    cy.get('#page-document .tabs-block').should(
      'contain',
      'Second tab content',
    );

    cy.visit('/cypress/my-page/edit');
    cy.contains('.tabs-block .ui.menu .item', 'Tab 2').click({ force: true });
    typeActiveTabContent(' updated');

    saveAndAssertViewUrl();

    getViewTabItem('Tab 2').click();
    cy.get('#page-document .tabs-block')
      .invoke('text')
      .should('match', /Second tab content\s*updated/);
  });

  it('restores selected tab from activeTab query param after reload', () => {
    setPageTitle('Tabs View ActiveTab Query');
    addTabsBlock();

    typeActiveTabContent('Alpha tab content');
    addSecondTabWithContent('Beta tab content');

    saveAndAssertViewUrl();

    getViewTabItem('Tab 2').focus().type('{enter}');
    cy.location('search').should('match', /\?activeTab=/);
    getViewTabItem('Tab 2').should('have.class', 'active');
    cy.get('#page-document .tabs-block').should('contain', 'Beta tab content');

    cy.reload();

    cy.location('search').should('match', /\?activeTab=/);
    getViewTabItem('Tab 2').should('have.class', 'active');
    cy.get('#page-document .tabs-block').should('contain', 'Beta tab content');
  });
});
