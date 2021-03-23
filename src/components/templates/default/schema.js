export default () => ({
  title: 'Default tabs block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description', 'align'],
    },
  ],
  properties: {
    description: {
      title: 'Description',
    },
    align: {
      title: 'Menu alignment',
      type: 'array',
      choices: [
        ['left', 'Left'],
        ['center', 'Center'],
        ['right', 'Right'],
        ['space-between', 'Space between'],
      ],
    },
  },
  required: [],
});
