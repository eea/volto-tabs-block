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

export default (props) => ({
  title: props.intl.formatMessage(messages.CarouselBlock),
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
      type: 'array',
      choices: [
        ['light', props.intl.formatMessage(messages.Light)],
        ['dark', props.intl.formatMessage(messages.Dark)],
        ['grey', props.intl.formatMessage(messages.Grey)],
      ],
      default: 'light',
    },
  },
  required: [],
});
