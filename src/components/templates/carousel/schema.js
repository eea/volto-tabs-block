import { defineMessages } from 'react-intl';

const messages = defineMessages({
  CarouselBlock: {
    id: 'carousel-block',
    defaultMessage: 'Carousel block',
  },
  Default: {
    id: 'default',
    defaultMessage: 'Default',
  },
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
});

export default (props, { intl }) => ({
  title: intl.formatMessage(messages.CarouselBlock),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.Default),
      fields: ['theme'],
    },
  ],
  properties: {
    theme: {
      title: intl.formatMessage(messages.Theme),
      choices: [
        ['light', intl.formatMessage(messages.Light)],
        ['dark', intl.formatMessage(messages.Dark)],
        ['grey', intl.formatMessage(messages.Grey)],
      ],
      default: 'light',
    },
  },
  required: [],
});
