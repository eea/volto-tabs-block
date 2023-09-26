import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Empty', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click();

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Media').click();
    cy.get('.content.active.media .button.image').contains('Image').click();

    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-title input').last().type('Tab 1');
    cy.get('.field-wrapper-template #field-template').click();
    cy.get('.react-select__menu').contains('Default').click();
    cy.get('.field-wrapper-verticalAlign #field-verticalAlign').click();
    cy.get('.react-select__menu').contains('Middle').click();

    cy.get('.field-wrapper-menuAlign #field-menuAlign').click();
    cy.get('.react-select__menu').contains('Left').click();
    cy.get('.field-wrapper-menuPosition #field-menuPosition').first().click();
    cy.get('.react-select__menu').contains('Top').click();

    cy.get('.tabs-block [contenteditable=true]').first().type('Hydrogen');
    cy.get('.tabs-block .ui.left.menu .item').last().click();
    cy.get('.tabs-block').contains('Tab 2').click();
    cy.get('.tabs-block.edit [contenteditable=true]').first().type('Oxygen');

    cy.getSlate().click();
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-template #field-template').click();
    cy.get('.react-select__menu').contains('Carousel horizontal').click();
    cy.get('.field-wrapper-verticalAlign #field-verticalAlign').click();
    cy.get('.react-select__menu').contains('Bottom').click();
    cy.get('.field-wrapper-theme #field-theme').click();
    cy.get('.react-select__menu').contains('Dark').click();
    cy.get('.tabs-block .ui.menu .item').last().click();
    cy.get('.tabs-block .ui.menu .item').eq(1).click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.contains('Hydrogen');

    cy.get('.tabs-block p').contains('Tab 2').click();
    cy.contains('Oxygen');

    cy.get('.slick-arrow').click();
    cy.get('.block.image');
  });

  it('Add Tabs Block Horizontal', () => {
    // Change page title    
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');
    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-title input').last().type('Tab 1');
    cy.get('.field-wrapper-template #field-template').click();
    cy.get('.react-select__menu').contains('Horizontal responsive').click();

    cy.get('.tabs-block [contenteditable=true]').first().type('Horizontal First Item');
    cy.get('.tabs-block .horizontal-responsive .ui.text.menu .item').last().click({force: true});
    cy.get('.tabs-block').contains('Tab 2').click();
    cy.get('.tabs-block.edit [contenteditable=true]').first().type('Horizontal Second Item');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.get('.tabs-block .horizontal-responsive.tabs').should('exist');
    cy.contains('Horizontal First Item');

    cy.get('.tabs-block p').contains('Tab 2').click();
    cy.contains('Horizontal Second Item');
  });

  it('Add Tabs Block Accordion', () => {
    // Change page title    
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');
    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-title input').last().type('Tab 1');
    cy.get('.field-wrapper-template #field-template').click();
    cy.get('.react-select__menu').contains('Accordion responsive').click();

    cy.get('.tabs-block [contenteditable=true]').first().type('Accordion First Item');
    cy.get('.tabs-block .menu-item-text').last().click({force: true});
    cy.get('.tabs-block').contains('Tab 2').click();
    cy.get('.tabs-block.edit [contenteditable=true]').first().type('Accordion Second Item');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.get('.tabs-block.accordion').should('exist');
    cy.contains('Accordion First Item');

    cy.get('.tabs-block').contains('Tab 2').click();
    cy.contains('Accordion Second Item');
  });
});
