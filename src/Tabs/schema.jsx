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
  ],

  properties: {
    tabs: {
      widget: 'object_list',
      title: 'Tabs',
      // this is an invention, should confront with dexterity serializer
      schema: Tab,
    },
  },

  required: ['display', 'cards'],
};

export default Tabs;
