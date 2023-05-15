import config from '@plone/volto/registry';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  AccordionTabsBlock: {
    id: 'accordion-tabs-block',
    defaultMessage: 'Accordion tabs block',
  },
  Default: {
    id: 'default',
    defaultMessage: 'Default',
  },
  Menu: {
    id: 'menu',
    defaultMessage: 'Menu',
  },
  Style: {
    id: 'style',
    defaultMessage: 'Style',
  },
  Description: {
    id: 'description',
    defaultMessage: 'Description',
  },
  IconPositionOnTheRight: {
    id: 'icon-position-on-the-right',
    defaultMessage: 'Icon position on the right',
  },
  PositionLeftRightIconAccordionTab: {
    id: 'position-left-right-of-the-icon-in-the-accordion-tab',
    defaultMessage: 'Position left/right of the icon in the accordion tab',
  },
  Inverted: {
    id: 'inverted',
    defaultMessage: 'Inverted',
  },
  Theme: {
    id: 'theme',
    defaultMessage: 'Theme',
  },
  SetThemeAccordionTabsBlock: {
    id: 'set-the-theme-for-the-accordion-tabs-block',
    defaultMessage: 'Set the theme for the accordion tabs block',
  },
});

export default () => ({
  title: intl.formatMessage(messages.AccordionTabsBlock),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.Default),
      fields: ['description'],
    },
    {
      id: 'menu',
      title: intl.formatMessage(messages.Menu),
      fields: ['menuInverted', 'accordionIconRight'],
    },
    {
      id: 'style',
      title: intl.formatMessage(messages.Style),
      fields: ['theme'],
    },
  ],
  properties: {
    description: {
      title: intl.formatMessage(messages.Description),
    },
    accordionIconRight: {
      title: intl.formatMessage(messages.IconPositionOnTheRight),
      description: intl.formatMessage(messages.PositionLeftRightIconAccordionTab),
      type: 'boolean',
    },
    menuInverted: {
      title: intl.formatMessage(messages.Inverted),
      type: 'boolean',
    },
    theme: {
      title: intl.formatMessage(messages.Theme),
      description: intl.formatMessage(messages.SetThemeAccordionTabsBlock),
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
