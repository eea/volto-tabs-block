import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Check tabs widget', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Tabs widget');

    cy.get('.documentFirstHeading').contains('Tabs widget');

    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-title input').last().type('Tab 1');
    cy.get('.tabs-area .accordion.ui').first().click();
    cy.get('#field-assetType-1-data-0').click();
    cy.contains('Icon').click();
    cy.get('#field-icon-2-data-0').type('delete');
    cy.get('#toolbar-save').click();
  });

  it('Add Tabs default template', () => {
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Tabs block default template');

    cy.get('.documentFirstHeading').contains('Tabs block default template');

    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-title input').last().type('Tab 1');
    cy.get('.field-wrapper-variation #field-variation').click();
    cy.get('.react-select__menu').contains('Default').click();
    cy.get('.field-wrapper-verticalAlign #field-verticalAlign').click();
    cy.get('.react-select__menu').contains('Middle').click();

    cy.get('.field-wrapper-menuAlign #field-menuAlign').click();
    cy.get('.react-select__menu').contains('Left').click();
    cy.get('.field-wrapper-menuPosition #field-menuPosition').first().click();
    cy.get('.react-select__menu').contains('Top').click();

    cy.get('.field-wrapper-menuPosition #field-menuPosition').first().click();
    cy.get('.react-select__menu').contains('Left').click();

    cy.get('.field-wrapper-menuPosition #field-menuPosition').first().click();
    cy.get('.react-select__menu').contains('Right').click();

    cy.get('.field-wrapper-menuPosition #field-menuPosition').first().click();
    cy.get('.react-select__menu').contains('Bottom').click();

    cy.get('.field-wrapper-menuPosition #field-menuPosition').first().click();
    cy.get('.react-select__menu').contains('Top').click();

    cy.get('.tabs-block [contenteditable=true]').first().type('Hydrogen');
    cy.get('.tabs-block .ui.left.menu .item').last().click();
    cy.get('.tabs-block.edit [contenteditable=true]').first().type('Oxygen');
    cy.get('.tabs-block a.item').first().type(' ');

    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('Tabs block default template');

    cy.get('.tabs-block .menu-item-text')
      .contains('Tab 2')
      .parent()
      .focus()
      .type('{enter}');

    cy.contains('Oxygen');

    cy.get('.tabs-block .menu-item-text').contains('Tab 1').click();

    cy.contains('Hydrogen');
  });

  it('Add Tabs carousel template', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Tabs block carousel template');

    cy.get('.documentFirstHeading').contains('Tabs block carousel template');

    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-variation #field-variation').click();
    cy.get('.react-select__menu').contains('Carousel horizontal').click();
    cy.get('.field-wrapper-verticalAlign #field-verticalAlign').click();
    cy.get('.react-select__menu').contains('Top').click();
    cy.get('.field-wrapper-theme #field-theme').click();
    cy.get('.react-select__menu').contains('Dark').click();
    cy.get('.tabs-block [contenteditable=true]').first().type('Hydrogen');
    cy.get('.tabs-block .ui.menu .item').last().click();
    cy.get('.tabs-block .ui.menu .item').eq(1).click();
    cy.get('.tabs-block').contains('Tab 2').click();
    cy.get('.tabs-block.edit [contenteditable=true]').first().type('Oxygen');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('Tabs block carousel template');
    cy.wait(500);
    cy.contains('Hydrogen');

    cy.get('.slick-arrow').click();
    cy.contains('Oxygen');
  });

  it('Add Tabs Block Horizontal', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Tabs block horizontal template');

    cy.get('.documentFirstHeading').contains('Tabs block horizontal template');
    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-title input').last().type('Tab 1');
    cy.get('.field-wrapper-variation #field-variation').click();
    cy.get('.react-select__menu').contains('Horizontal responsive').click();

    cy.get('.tabs-block [contenteditable=true]')
      .first()
      .type('Horizontal First Item');
    cy.get('.tabs-block .horizontal-responsive .ui.menu .item')
      .last()
      .click({ force: true });
    cy.get('.tabs-block').contains('Tab 2').click();
    cy.get('.tabs-block.edit [contenteditable=true]')
      .first()
      .type('Horizontal Second Item');
    cy.get('.tabs-block .horizontal-responsive .ui.menu .item')
      .last()
      .click({ force: true });
    cy.get('.tabs-block').contains('Tab 3').dblclick().type('Tab 3 edited');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('Tabs block horizontal template');
    cy.get('.tabs-block .horizontal-responsive.tabs').should('exist');
    cy.contains('Horizontal First Item');

    cy.get('.tabs-block .menu-item-text')
      .contains('Tab 2')
      .parent()
      .focus()
      .type('{enter}');
    cy.contains('Horizontal Second Item');

    cy.get('.tabs-block .menu-item-text').contains('Tab 1').click();
    cy.contains('Horizontal First Item');
  });

  it('Add Tabs Block Accordion', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Tabs block accordion template');

    cy.get('.documentFirstHeading').contains('Tabs block accordion template');
    cy.getSlate().click();

    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Common').click();
    cy.get('.content.active.common .button.tabs_block')
      .contains('Tabs')
      .click({ force: true });

    cy.get('.field-wrapper-title input').last().type('Tab 1');
    cy.get('.field-wrapper-variation #field-variation').click();
    cy.get('.react-select__menu').contains('Accordion responsive').click();

    cy.get('.tabs-block [contenteditable=true]')
      .first()
      .type('Accordion First Item');
    cy.get('.tabs-block .menu-item-text').last().click({ force: true });
    cy.get('.tabs-block').contains('Tab 2').click();
    cy.get('.tabs-block.edit [contenteditable=true]')
      .first()
      .type('Accordion Second Item');
    cy.get(
      '.block-editor-tabs_block + .block-editor-slate .block.slate:not(.ui)',
    ).click();

    cy.get('.tabs-block').contains('Tab 1').dblclick().type('Tab 1 edited');

    // Add new tab
    cy.get('.tabs-block .addition-button').click();
    cy.get('.tabs-block').contains('Tab 3').dblclick().type('Tab 3 edited');

    // Add new tab
    cy.get('.tabs-block .addition-button').click();
    cy.get('.tabs-block').contains('Tab 4').dblclick().type('Tab 4 edited');

    // Add new tab
    cy.get('.tabs-block .addition-button').click();
    cy.get('.tabs-block').contains('Tab 5').dblclick().type('Tab 5 edited');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('Tabs block accordion template');
    cy.get('.tabs-block.accordion').should('exist');
    cy.contains('Accordion First Item');

    cy.get('.tabs-block').contains('Tab 2').click();
    cy.contains('Accordion Second Item');
    cy.get('.tabs-block .RRT__tab--first').focus().type('{enter}');
    cy.contains('Accordion First Item');

    // switch to mobile view
    cy.viewport('iphone-6');

    cy.contains('Accordion First Item');
  });
});
