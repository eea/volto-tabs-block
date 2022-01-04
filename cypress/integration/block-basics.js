import { setupBeforeEach, tearDownAfterEach } from '../support';

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Block: Empty', () => {
    // without this the clear command below does nothing sometimes
    cy.wait(500);

    // Change page title
    cy.get('[contenteditable=true]').first().clear();

    cy.get('[contenteditable=true]').first().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.get('[contenteditable=true]').first().type('{enter}');

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Media').click();
    cy.get('.content.active.media .button.image').contains('Image').click();

    cy.get('[contenteditable=true]').first().type('{enter}');
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.tabs_block').click();

    cy.get('.field-wrapper-title input').last().type('Tab 1');
    cy.get('.field-wrapper-template #field-template').click();
    cy.get('.react-select__menu').contains('Default').click();
    cy.get('.field-wrapper-verticalAlign #field-verticalAlign').click();
    cy.get('.react-select__menu').contains('Middle').click();

    cy.get('.field-wrapper-menuAlign #field-menuAlign').click();
    cy.get('.react-select__menu').contains('Left').click();
    cy.get('.field-wrapper-menuPosition #field-menuPosition').first().click();
    cy.get('.react-select__menu').contains('Inline').click();

    cy.get('[contenteditable=true]').first().focus().click();
    cy.get('.tabs-block [contenteditable=true]').first().type("Hydrogen");
    cy.get('.tabs-block .ui.left.menu .item').last().click();
    cy.get('.tabs-block').contains('Tab 2').click();
    cy.get('.tabs-block.edit [contenteditable=true]').first().type("Oxygen");


    cy.get('[contenteditable=true]').first().type('{enter}');
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.tabs_block').first().click();

    cy.get('.field-wrapper-template #field-template').click();
    cy.get('.react-select__menu').contains('Carousel horizontal').click();
    cy.get('.field-wrapper-verticalAlign #field-verticalAlign').click();
    cy.get('.react-select__menu').contains('Bottom').click();
    cy.get('.field-wrapper-theme #field-theme').click();
    cy.get('.react-select__menu').contains('Dark').click();
    cy.get('.tabs-block .ui.left.menu .item').eq(1).click();


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
});
