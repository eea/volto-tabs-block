import config from '@plone/volto/registry';

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
      fields: ['menuInverted', 'accordionIconRight'],
    },
    {
      id: 'style',
      title: 'Style',
      fields: ['theme'],
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
    menuInverted: {
      title: 'Inverted',
      type: 'boolean',
    },
    theme: {
      title: 'Theme',
      description: 'Set the theme for the accordion tabs block',
      widget: 'theme_picker',
      colors: [
        ...(config.settings && config.settings.themeColors
          ? config.settings.themeColors.map(({ value, title }) => ({
              name: value,
              label: title,
            }))
          : []),
      ],
    },
  },
  required: [],
});
