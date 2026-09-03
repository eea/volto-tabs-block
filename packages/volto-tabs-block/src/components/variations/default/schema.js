import { defineMessages } from 'react-intl';

const messages = defineMessages({
  DefaultTabsBlock: {
    id: 'default-tabs-block',
    defaultMessage: 'Default tabs block',
  },
  Default: {
    id: 'default',
    defaultMessage: 'Default',
  },
  Menu: {
    id: 'menu',
    defaultMessage: 'Menu',
  },
  Description: {
    id: 'description',
    defaultMessage: 'Description',
  },
  Position: {
    id: 'position',
    defaultMessage: 'Position',
  },
  Top: {
    id: 'top',
    defaultMessage: 'Top',
  },
  Bottom: {
    id: 'bottom',
    defaultMessage: 'Bottom',
  },
  LeftSide: {
    id: 'left-side',
    defaultMessage: 'Left side',
  },
  RightSide: {
    id: 'right-side',
    defaultMessage: 'Right side',
  },
  Alignment: {
    id: 'alignment',
    defaultMessage: 'Alignment',
  },
  Left: {
    id: 'left',
    defaultMessage: 'Left',
  },
  Center: {
    id: 'center',
    defaultMessage: 'Center',
  },
  Right: {
    id: 'right',
    defaultMessage: 'Right',
  },
  SpaceBetween: {
    id: 'space-between',
    defaultMessage: 'Space between',
  },
  Size: {
    id: 'size',
    defaultMessage: 'Size',
  },
  Mini: {
    id: 'mini',
    defaultMessage: 'Mini',
  },
  Tiny: {
    id: 'tiny',
    defaultMessage: 'Tiny',
  },
  Small: {
    id: 'small',
    defaultMessage: 'Small',
  },
  Large: {
    id: 'large',
    defaultMessage: 'Large',
  },
  Huge: {
    id: 'huge',
    defaultMessage: 'Huge',
  },
  Massive: {
    id: 'massive',
    defaultMessage: 'Massive',
  },
  Color: {
    id: 'color',
    defaultMessage: 'Color',
  },
  Red: {
    id: 'red',
    defaultMessage: 'Red',
  },
  Orange: {
    id: 'orange',
    defaultMessage: 'Orange',
  },
  Yellow: {
    id: 'yellow',
    defaultMessage: 'Yellow',
  },
  Olive: {
    id: 'olive',
    defaultMessage: 'Olive',
  },
  Green: {
    id: 'green',
    defaultMessage: 'Green',
  },
  Teal: {
    id: 'teal',
    defaultMessage: 'Teal',
  },
  Blue: {
    id: 'blue',
    defaultMessage: 'Blue',
  },
  Violet: {
    id: 'violet',
    defaultMessage: 'Violet',
  },
  Purple: {
    id: 'purple',
    defaultMessage: 'Purple',
  },
  Pink: {
    id: 'pink',
    defaultMessage: 'Pink',
  },
  Brown: {
    id: 'brown',
    defaultMessage: 'Brown',
  },
  Grey: {
    id: 'grey',
    defaultMessage: 'Grey',
  },
  Black: {
    id: 'black',
    defaultMessage: 'Black',
  },
  MenuBorderless: {
    id: 'menu-border-less',
    defaultMessage: 'Borderless',
  },
  MenuCompact: {
    id: 'menu-compact',
    defaultMessage: 'Compact',
  },
  MenuFluid: {
    id: 'menu-fluid',
    defaultMessage: 'Fluid',
  },
  MenuInverted: {
    id: 'menu-inverted',
    defaultMessage: 'Inverted',
  },
  MenuPointing: {
    id: 'menu-pointing',
    defaultMessage: 'Pointing',
  },
  MenuSecondary: {
    id: 'menu-secondary',
    defaultMessage: 'Secondary',
  },
  MenuStackable: {
    id: 'menu-stackable',
    defaultMessage: 'Stackable',
  },
  MenuTabular: {
    id: 'menu-tabular',
    defaultMessage: 'Tabular',
  },
  MenuText: {
    id: 'menu-text',
    defaultMessage: 'Text',
  },
});

export const defaultSchemaEnhancer = ({ schema, intl }) => {
  schema.fieldsets.splice(1, 0, {
    id: 'menu',
    title: intl.formatMessage(messages.Menu),
    fields: [
      'menuAlign',
      'menuPosition',
      'menuSize',
      'menuColor',
      'menuBorderless',
      'menuCompact',
      'menuFluid',
      'menuInverted',
      'menuPointing',
      'menuSecondary',
      'menuStackable',
      'menuTabular',
      'menuText',
    ],
  });
  schema.properties = {
    ...schema.properties,
    description: {
      title: intl.formatMessage(messages.Description),
    },
    menuPosition: {
      title: intl.formatMessage(messages.Position),
      choices: [
        ['top', intl.formatMessage(messages.Top)],
        ['bottom', intl.formatMessage(messages.Bottom)],
        ['left side', intl.formatMessage(messages.LeftSide)],
        ['right side', intl.formatMessage(messages.RightSide)],
      ],
    },
    menuAlign: {
      title: intl.formatMessage(messages.Alignment),
      choices: [
        ['left', intl.formatMessage(messages.Left)],
        ['center', intl.formatMessage(messages.Center)],
        ['right', intl.formatMessage(messages.Right)],
        ['space-between', intl.formatMessage(messages.SpaceBetween)],
      ],
    },
    menuSize: {
      title: intl.formatMessage(messages.Size),
      choices: [
        ['mini', intl.formatMessage(messages.Mini)],
        ['tiny', intl.formatMessage(messages.Tiny)],
        ['small', intl.formatMessage(messages.Small)],
        ['large', intl.formatMessage(messages.Large)],
        ['huge', intl.formatMessage(messages.Huge)],
        ['massive', intl.formatMessage(messages.Massive)],
      ],
    },
    menuColor: {
      title: intl.formatMessage(messages.Color),
      choices: [
        ['red', intl.formatMessage(messages.Red)],
        ['orange', intl.formatMessage(messages.Orange)],
        ['yellow', intl.formatMessage(messages.Yellow)],
        ['olive', intl.formatMessage(messages.Olive)],
        ['green', intl.formatMessage(messages.Green)],
        ['teal', intl.formatMessage(messages.Teal)],
        ['blue', intl.formatMessage(messages.Blue)],
        ['violet', intl.formatMessage(messages.Violet)],
        ['purple', intl.formatMessage(messages.Purple)],
        ['pink', intl.formatMessage(messages.Pink)],
        ['brown', intl.formatMessage(messages.Brown)],
        ['grey', intl.formatMessage(messages.Grey)],
        ['black', intl.formatMessage(messages.Black)],
      ],
    },
    menuBorderless: {
      title: intl.formatMessage(messages.MenuBorderless),
      type: 'boolean',
    },
    menuCompact: {
      title: intl.formatMessage(messages.MenuCompact),
      type: 'boolean',
    },
    menuFluid: {
      title: intl.formatMessage(messages.MenuFluid),
      type: 'boolean',
      default: true,
    },
    menuInverted: {
      title: intl.formatMessage(messages.MenuInverted),
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
    menuStackable: {
      title: intl.formatMessage(messages.MenuStackable),
      type: 'boolean',
    },
    menuTabular: {
      title: intl.formatMessage(messages.MenuTabular),
      type: 'boolean',
    },
    menuText: {
      title: intl.formatMessage(messages.MenuText),
      type: 'boolean',
    },
  };
  return schema;
};
