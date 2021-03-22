export default () => ({
  title: 'Carousel block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['theme'],
    },
  ],
  properties: {
    theme: {
      title: 'Theme',
      type: 'array',
      choices: [
        ['light', 'Light'],
        ['dark', 'Dark'],
        ['grey', 'Grey'],
      ],
      default: 'light',
    },
  },
  required: [],
});
