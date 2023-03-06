export default () => ({
  title: 'Accordion tabs block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description'],
    },
    {
      id: 'menu',
      title: 'Menu',
      fields: ['menuColor', 'menuInverted', 'accordionIconRight'],
    },
  ],
  properties: {
    description: {
      title: 'Description',
    },
    accordionIconRight: {
      title: 'Icon position on the right',
      description: 'Position left/right of the icon in the accordion tab',
      type: 'boolean',
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
    menuInverted: {
      title: 'Inverted',
      type: 'boolean',
    },
  },
  required: [],
});
