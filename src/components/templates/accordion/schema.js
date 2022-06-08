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
      fields: ['menuColor', 'menuInverted'],
    },
  ],
  properties: {
    description: {
      title: 'Description',
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
