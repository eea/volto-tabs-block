export default () => ({
  title: 'Default tabs block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['menuAlign', 'description'],
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
    description: {
      title: 'Description',
    },
  },
  required: [],
});
