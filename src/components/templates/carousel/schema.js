import { defineMessages } from 'react-intl';

const messages = defineMessages({
  CarouselTabsBlock: {
    id: 'carousel-tabs-block',
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

export default (config, props) => ({
  title: props.intl.formatMessage(messages.CarouselTabsBlock),
  fieldsets: [
    {
      id: 'default',
      title: props.intl.formatMessage(messages.Default),
      fields: ['theme'],
    },
  ],
  properties: {
    theme: {
      title: props.intl.formatMessage(messages.Theme),
      choices: [
        ['light',props.intl.formatMessage(messages.Light)],
        ['dark', props.intl.formatMessage(messages.Dark)],
        ['grey', props.intl.formatMessage(messages.Grey)],
      ],
      default: 'light',
    },
  },
  required: [],
});
