import { defineMessages, useIntl } from 'react-intl';

const blocksArray = (config) => {
  return Object.keys(config.blocks.blocksConfig)
    .map((key) => {
      if (config.blocks.blocksConfig[key]?.restricted) {
        return false;
      } else {
        const title = config.blocks.blocksConfig[key]?.title || key;
        return [key, title];
      }
    })
    .filter((val) => !!val);
};

const messages = defineMessages({
  tabsBlockSetting: {
    id: 'tabsBlockSetting',
    defaultMessage: 'Tabs block setting',
  },
  default: {
    id: 'default',
    defaultMessage: 'Default',
  },
  allowedBlocks: {
    id: 'allowedBlocks',
    defaultMessage: 'Allowed blocks',
  },
  allowedBlocksDescription: {
    id: 'allowedBlocksDescription',
    defaultMessage: 'Allow only the following block types',
  },
  helperText: {
    id: 'helperText',
    defaultMessage: 'Helper text',
  },
  placeholderDescription: {
    id: 'placeholderDescription',
    defaultMessage:
      'A short hint that describes the expected value within this block',
  },
  instructions: {
    id: 'instructions',
    defaultMessage: 'Instructions',
  },
  instructionsDescription: {
    id: 'instructionsDescription',
    defaultMessage: 'Detailed expected value within this block',
  },
  required: {
    id: 'required',
    defaultMessage: 'Required',
  },
  requiredDescription: {
    id: 'requiredDescription',
    defaultMessage: "Don't allow deletion of this block",
  },
  fixed: {
    id: 'fixed',
    defaultMessage: 'Fixed position',
  },
  fixedDescription: {
    id: 'fixedDescription',
    defaultMessage: 'Disable drag & drop on this block',
  },
  disableNewBlocks: {
    id: 'disableNewBlocks',
    defaultMessage: 'Disable new blocks',
  },
  disableNewBlocksDescription: {
    id: 'disableNewBlocksDescription',
    defaultMessage: 'Disable creation of new blocks after this block',
  },
  readOnly: {
    id: 'readOnly',
    defaultMessage: 'Read-only',
  },
  readOnlyDescription: {
    id: 'readOlnyDescription',
    defaultMessage: 'Disable editing on this block',
  },
  readOnlySettings: {
    id: 'readOnlySettings',
    defaultMessage: 'Read-only settings',
  },
  readOnlySettingsDescription: {
    id: 'readOnlySettingsDescription',
    defaultMessage: 'Disable editing on columns block settings',
  },
});

export default (config) => {
  const intl = useIntl();
  return {
    title: intl.formatMessage(messages.tabsBlockSetting),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.default),
        fields: [
          'placeholder',
          'instructions',
          'allowedBlocks',
          'required',
          'fixed',
          'disableNewBlocks',
          'readOnly',
          'readOnlySettings',
        ],
      },
    ],
    properties: {
      allowedBlocks: {
        title: intl.formatMessage(messages.allowedBlocks),
        description: intl.formatMessage(messages.allowedBlocksDescription),
        type: 'array',
        items: {
          choices: blocksArray(config),
        },
      },
      placeholder: {
        title: intl.formatMessage(messages.helperText),
        description: intl.formatMessage(messages.placeholderDescription),
        type: 'string',
      },
      instructions: {
        title: intl.formatMessage(messages.instructions),
        description: intl.formatMessage(messages.instructionsDescription),
        type: 'string',
        widget: 'richtext',
      },
      required: {
        title: intl.formatMessage(messages.required),
        description: intl.formatMessage(messages.requiredDescription),
        type: 'boolean',
      },
      fixed: {
        title: intl.formatMessage(messages.fixed),
        description: intl.formatMessage(messages.fixedDescription),
        type: 'boolean',
      },
      disableNewBlocks: {
        title: intl.formatMessage(messages.disableNewBlocks),
        description: intl.formatMessage(messages.disableNewBlocksDescription),
        type: 'boolean',
      },
      readOnly: {
        title: intl.formatMessage(messages.readOnly),
        description: intl.formatMessage(messages.readOnlyDescription),
        type: 'boolean',
      },
      readOnlySettings: {
        title: intl.formatMessage(messages.readOnlySettings),
        description: intl.formatMessage(messages.readOnlySettingsDescription),
        type: 'boolean',
      },
    },
    required: [],
  };
};
