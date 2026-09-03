import { defineMessages } from 'react-intl';

const messages = defineMessages({
  Theme: {
    id: 'theme',
    defaultMessage: 'Theme',
  },
  Light: {
    id: 'light',
    defaultMessage: 'Light',
  },
  Dark: {
    id: 'dark',
    defaultMessage: 'Dark',
  },
  Grey: {
    id: 'grey',
    defaultMessage: 'Grey',
  },
  Style: {
    id: 'style',
    defaultMessage: 'Style',
  },
});

export const carouselSchemaEnhancer = ({ schema, intl }) => {
  schema.fieldsets.splice(1, 0, {
    id: 'style',
    title: intl.formatMessage(messages.Style),
    fields: ['theme'],
  });
  schema.properties = {
    ...schema.properties,
    theme: {
      title: intl.formatMessage(messages.Theme),
      choices: [
        ['light', intl.formatMessage(messages.Light)],
        ['dark', intl.formatMessage(messages.Dark)],
        ['grey', intl.formatMessage(messages.Grey)],
      ],
      default: 'light',
    },
  };
  return schema;
};
