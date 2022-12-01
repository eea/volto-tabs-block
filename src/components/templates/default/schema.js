import { messages } from '@eeacms/volto-tabs-block/utils';

export default (config, { intl }) => ({
  title: intl.formatMessage(messages.defaultTabsBlock),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.default),
      fields: ['description'],
    },
    {
      id: 'menu',
      title: intl.formatMessage(messages.menu),
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
      title: intl.formatMessage(messages.description),
    },
    menuPosition: {
      title: intl.formatMessage(messages.position),
      choices: [
        ['top', intl.formatMessage(messages.top)],
        ['bottom', intl.formatMessage(messages.bottom)],
        ['left side', intl.formatMessage(messages.leftSide)],
        ['right side', intl.formatMessage(messages.rightSide)],
      ],
    },
    menuAlign: {
      title: intl.formatMessage(messages.aligment),
      type: 'array',
      choices: [
        ['left', intl.formatMessage(messages.left)],
        ['center', intl.formatMessage(messages.center)],
        ['right', intl.formatMessage(messages.right)],
        ['space-between', intl.formatMessage(messages.spaceBetween)],
      ],
    },
    menuSize: {
      title: intl.formatMessage(messages.size),
      choices: [
        ['mini', intl.formatMessage(messages.mini)],
        ['tiny', intl.formatMessage(messages.tiny)],
        ['small', intl.formatMessage(messages.small)],
        ['large', intl.formatMessage(messages.large)],
        ['huge', intl.formatMessage(messages.huge)],
        ['massive', intl.formatMessage(messages.massive)],
      ],
    },
    menuColor: {
      title: intl.formatMessage(messages.color),
      defaultValue: 'green',
      choices: [
        ['red', intl.formatMessage(messages.red)],
        ['orange', intl.formatMessage(messages.orange)],
        ['yellow', intl.formatMessage(messages.yellow)],
        ['olive', intl.formatMessage(messages.olive)],
        ['green', intl.formatMessage(messages.green)],
        ['teal', intl.formatMessage(messages.teal)],
        ['blue', intl.formatMessage(messages.blue)],
        ['violet', intl.formatMessage(messages.violet)],
        ['purple', intl.formatMessage(messages.purple)],
        ['pink', intl.formatMessage(messages.pink)],
        ['brown', intl.formatMessage(messages.brown)],
        ['grey', intl.formatMessage(messages.grey)],
        ['black', intl.formatMessage(messages.black)],
      ],
    },
    menuBorderless: {
      title: intl.formatMessage(messages.borderless),
      type: 'boolean',
    },
    menuCompact: {
      title: intl.formatMessage(messages.compact),
      type: 'boolean',
      defaultValue: true,
    },
    menuFluid: {
      title: intl.formatMessage(messages.fluid),
      type: 'boolean',
      defaultValue: true,
    },
    menuInverted: {
      title: intl.formatMessage(messages.compact),
      type: 'boolean',
    },
    menuPointing: {
      title: intl.formatMessage(messages.pointing),
      type: 'boolean',
    },
    menuSecondary: {
      title: intl.formatMessage(messages.secondary),
      type: 'boolean',
    },
    menuStackable: {
      title: intl.formatMessage(messages.stackable),
      type: 'boolean',
    },
    menuTabular: {
      title: intl.formatMessage(messages.tabular),
      type: 'boolean',
    },
    menuText: {
      title: intl.formatMessage(messages.text),
      type: 'boolean',
      defaultValue: true,
    },
  },
  required: [],
});
