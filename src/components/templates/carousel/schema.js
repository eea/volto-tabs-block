export default () => ({
  title: 'Carousel block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['scrollIcon', 'theme'],
    },
  ],
  properties: {
    scrollIcon: {
      title: 'Scroll icon',
      type: 'boolean',
    },
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
