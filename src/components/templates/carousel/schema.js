import { messages } from '@eeacms/volto-tabs-block/utils';

export default (config, { intl }) => ({
  title: intl.formatMessage(messages.carouselBlock),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.default),
      fields: ['theme'],
    },
  ],
  properties: {
    theme: {
      title: intl.formatMessage(messages.theme),
      type: 'array',
      choices: [
        ['light', intl.formatMessage(messages.light)],
        ['dark', intl.formatMessage(messages.dark)],
        ['grey', intl.formatMessage(messages.grey)],
      ],
      default: 'light',
    },
  },
  required: [],
});
