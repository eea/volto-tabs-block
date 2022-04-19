export default () => ({
  title: 'Default tabs block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description'],
    },
    {
      id: 'menu',
      title: 'Menu',
      fields: [
        'menuAlign',
        'menuPosition',
        'menuSize',
        'menuColor',
        'menuBorderless',
        'menuCompact',
        'menuFluid',
        'menuInverted',
        'menuPointing',
        'menuSecondary',
        'menuStackable',
        'menuTabular',
        'menuText',
        'responsive',
      ],
    },
  ],
  properties: {
    responsive: {
      title: 'Responsive?',
      description: 'Renders a dropdown menu for overflow tabs',
      type: 'boolean',
      defaultValue: false,
    },
    description: {
      title: 'Description',
    },
    menuPosition: {
      title: 'Position',
      choices: [
        ['top', 'Top'],
        ['bottom', 'Bottom'],
        ['left side', 'Left side'],
        ['right side', 'Right side'],
      ],
    },
    menuAlign: {
      title: 'Alignment',
      type: 'array',
      choices: [
        ['left', 'Left'],
        ['center', 'Center'],
        ['right', 'Right'],
        ['space-between', 'Space between'],
      ],
    },
    menuSize: {
      title: 'Size',
      choices: [
        ['mini', 'Mini'],
        ['tiny', 'Tiny'],
        ['small', 'Small'],
        ['large', 'Large'],
        ['huge', 'Huge'],
        ['massive', 'Masive'],
      ],
    },
    menuColor: {
      title: 'Color',
      defaultValue: 'green',
      choices: [
        ['red', 'Red'],
        ['orange', 'Orange'],
        ['yellow', 'Yellow'],
        ['olive', 'Olive'],
        ['green', 'Green'],
        ['teal', 'Teal'],
        ['blue', 'Blue'],
        ['violet', 'Violet'],
        ['purple', 'Purple'],
        ['pink', 'Pink'],
        ['brown', 'Brown'],
        ['grey', 'Grey'],
        ['black', 'Black'],
      ],
    },
    menuBorderless: {
      title: 'Borderless',
      type: 'boolean',
    },
    menuCompact: {
      title: 'Compact',
      type: 'boolean',
      defaultValue: true,
    },
    menuFluid: {
      title: 'Fluid',
      type: 'boolean',
      defaultValue: true,
    },
    menuInverted: {
      title: 'Inverted',
      type: 'boolean',
    },
    menuPointing: {
      title: 'Pointing',
      type: 'boolean',
    },
    menuSecondary: {
      title: 'Secondary',
      type: 'boolean',
    },
    menuStackable: {
      title: 'Stackable',
      type: 'boolean',
    },
    menuTabular: {
      title: 'Tabular',
      type: 'boolean',
    },
    menuText: {
      title: 'Text',
      type: 'boolean',
      defaultValue: true,
    },
  },
  required: [],
});
