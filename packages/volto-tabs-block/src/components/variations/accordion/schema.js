import { defineMessages } from 'react-intl';
import config from '@plone/volto/registry';

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
  MenuPointing: {
    id: 'menu-pointing',
    defaultMessage: 'Pointing',
  },
  MenuSecondary: {
    id: 'menu-secondary',
    defaultMessage: 'Secondary',
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

export const accordionSchemaEnhancer = ({ schema, intl }) => {
  schema.fieldsets.splice(1, 0, {
    id: 'menu',
    title: intl.formatMessage(messages.Menu),
    fields: [
      'menuInverted',
      'menuSecondary',
      'menuPointing',
      'accordionIconRight',
    ],
  });

  schema.fieldsets.splice(2, 0, {
    id: 'style',
    title: intl.formatMessage(messages.Style),
    fields: ['theme'],
  });

  schema.properties = {
    ...schema.properties,
    accordionIconRight: {
      title: intl.formatMessage(messages.IconPositionOnTheRight),
      description: intl.formatMessage(
        messages.PositionLeftRightIconAccordionTab,
      ),
      type: 'boolean',
    },
    menuInverted: {
      title: intl.formatMessage(messages.Inverted),
      type: 'boolean',
    },
    menuPointing: {
      title: intl.formatMessage(messages.MenuPointing),
      type: 'boolean',
      default: true,
    },
    menuSecondary: {
      title: intl.formatMessage(messages.MenuSecondary),
      type: 'boolean',
      default: true,
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
  };
  return schema;
};
