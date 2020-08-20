export const Tab = {
  title: 'Tab',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title'],
    },
  ],

  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
  },

  required: ['title'],
};

export const Tabs = {
  title: 'Tabs',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['tabs'],
    },
    {
      id: 'settings',
      title: 'Settings',
      fields: ['position', 'css_class'],
    },
  ],

  properties: {
    css_class: {
      title: 'CSS Class',
      default: 'default-tabsblock',
      widget: 'string',
    },
    tabs: {
      widget: 'object_list',
      title: 'Tabs',
      // this is an invention, should confront with dexterity serializer
      schema: Tab,
    },
    position: {
      title: 'Position',
      description: 'Position of the tabs, content related',
      factory: 'Choice',
      type: 'string',
      choices: [
        ['top', 'Top'],
        ['bottom', 'Bottom'],
        ['left', 'Left'],
        ['right', 'Right'],
      ],
    },
  },

  required: ['display', 'cards'],
};

export default Tabs;
