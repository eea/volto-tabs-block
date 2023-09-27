import { defineMessages } from 'react-intl';

const messages = defineMessages({
  HorizontalTabsBlock: {
    id: 'horizontal-tabs-block',
    defaultMessage: 'Horizontal tabs block',
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

export default (config, props) => ({
  title: props.intl.formatMessage(messages.HorizontalTabsBlock),
  fieldsets: [
    {
      id: 'default',
      title: props.intl.formatMessage(messages.Default),
      fields: ['description'],
    },
    {
      id: 'menu',
      title: props.intl.formatMessage(messages.Menu),
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
    },
  ],
  properties: {
    description: {
      title: props.intl.formatMessage(messages.Description),
    },
    menuPosition: {
      title: props.intl.formatMessage(messages.Position),
      choices: [
        ['top', props.intl.formatMessage(messages.Top)],
        ['bottom', props.intl.formatMessage(messages.Bottom)],
        ['left side', props.intl.formatMessage(messages.LeftSide)],
        ['right side', props.intl.formatMessage(messages.RightSide)],
      ],
    },
    menuAlign: {
      title: 'Alignment',
      choices: [
        ['left', props.intl.formatMessage(messages.Left)],
        ['center', props.intl.formatMessage(messages.Center)],
        ['right', props.intl.formatMessage(messages.Right)],
        ['space-between', props.intl.formatMessage(messages.SpaceBetween)],
      ],
    },
    menuSize: {
      title: props.intl.formatMessage(messages.Size),
      choices: [
        ['mini', props.intl.formatMessage(messages.Mini)],
        ['tiny', props.intl.formatMessage(messages.Tiny)],
        ['small', props.intl.formatMessage(messages.Small)],
        ['large', props.intl.formatMessage(messages.Large)],
        ['huge', props.intl.formatMessage(messages.Huge)],
        ['massive', props.intl.formatMessage(messages.Massive)],
      ],
    },
    menuColor: {
      title: props.intl.formatMessage(messages.Color),
      defaultValue: 'green',
      choices: [
        ['red', props.intl.formatMessage(messages.Red)],
        ['orange', props.intl.formatMessage(messages.Orange)],
        ['yellow', props.intl.formatMessage(messages.Yellow)],
        ['olive', props.intl.formatMessage(messages.Olive)],
        ['green', props.intl.formatMessage(messages.Green)],
        ['teal', props.intl.formatMessage(messages.Teal)],
        ['blue', props.intl.formatMessage(messages.Blue)],
        ['violet', props.intl.formatMessage(messages.Violet)],
        ['purple', props.intl.formatMessage(messages.Purple)],
        ['pink', props.intl.formatMessage(messages.Pink)],
        ['brown', props.intl.formatMessage(messages.Brown)],
        ['grey', props.intl.formatMessage(messages.Grey)],
        ['black', props.intl.formatMessage(messages.Black)],
      ],
    },
    menuBorderless: {
      title: props.intl.formatMessage(messages.MenuBorderless),
      type: 'boolean',
    },
    menuCompact: {
      title: props.intl.formatMessage(messages.MenuCompact),
      type: 'boolean',
      defaultValue: true,
    },
    menuFluid: {
      title: props.intl.formatMessage(messages.MenuFluid),
      type: 'boolean',
      defaultValue: true,
    },
    menuInverted: {
      title: props.intl.formatMessage(messages.MenuInverted),
      type: 'boolean',
    },
    menuPointing: {
      title: props.intl.formatMessage(messages.MenuPointing),
      type: 'boolean',
    },
    menuSecondary: {
      title: props.intl.formatMessage(messages.MenuSecondary),
      type: 'boolean',
    },
    menuStackable: {
      title: props.intl.formatMessage(messages.MenuStackable),
      type: 'boolean',
    },
    menuTabular: {
      title: props.intl.formatMessage(messages.MenuTabular),
      type: 'boolean',
    },
    menuText: {
      title: props.intl.formatMessage(messages.MenuText),
      type: 'boolean',
      defaultValue: true,
    },
  },
  required: [],
});
