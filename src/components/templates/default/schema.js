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
      fields: ['menuAlign', 'menuPosition'],
    },
  ],
  properties: {
    menuAlign: {
      title: 'Alignment',
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
      title: 'Position',
      type: 'array',
      choices: [
        ['inline', 'Inline'],
        ['left side', 'Left side'],
        ['right side', 'Right side'],
      ],
      default: 'inline',
    },
    description: {
      title: 'Description',
    },
  },
  required: [],
});
