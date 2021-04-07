export default () => ({
  title: 'Default tabs block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['menuAlign', 'menuPosition', 'description'],
    },
  ],
  properties: {
    menuAlign: {
      title: 'Menu alignment',
      type: 'array',
      choices: [
        ['left', 'Left'],
        ['center', 'Center'],
        ['right', 'Right'],
        ['space-between', 'Space between'],
      ],
      default: 'left',
    },
    menuPosition: {
      title: 'Menu position',
      type: 'array',
      choices: [
        ['inline', 'Inline'],
        ['left', 'Left side'],
        ['right', 'Right side'],
      ],
      default: 'inline',
    },
    description: {
      title: 'Description',
    },
  },
  required: [],
});
