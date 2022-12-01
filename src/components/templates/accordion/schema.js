import { messages } from '@eeacms/volto-tabs-block/utils';

export default (config, { intl }) => ({
  title: intl.formatMessage(messages.acordionTabsBlock),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.default),
      fields: ['description'],
    },
    {
      id: 'menu',
      title: intl.formatMessage(messages.menu),
      fields: ['menuColor', 'menuInverted'],
    },
  ],
  properties: {
    description: {
      title: intl.formatMessage(messages.description),
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
    menuInverted: {
      title: intl.formatMessage(messages.compact),
      type: 'boolean',
    },
  },
  required: [],
});
