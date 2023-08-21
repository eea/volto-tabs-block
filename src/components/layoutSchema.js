import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  TabsBlockSettings: {
    id: 'tabs-block-settings',
    defaultMessage: 'Tabs block settings',
  },
  Default: {
    id: 'default',
    defaultMessage: 'Default',
  },
  AllowedBlocks: {
    id: 'allowed-blocks',
    defaultMessage: 'Allowed blocks',
  },
  AllowOnlyTheFollowingBlocksTypes: {
    id: 'allow-only-the-following-blocks-types',
    defaultMessage: 'Allow only the following blocks types',
  },
  HelperText: {
    id: 'helper-text',
    defaultMessage: 'Helper text',
  },
  ShortHintThatDescribesTheExpectedValueWithinThisBlock: {
    id: 'a-short-hint-that-describes-the-expected-value-within-this-block',
    defaultMessage:
      'A short hint that describes the expected value within this block',
  },
  Instructions: {
    id: 'instructions',
    defaultMessage: 'Instructions',
  },
  DetailedExpectedValueWithinThisBlock: {
    id: 'detailed-expected-value-within-this-block',
    defaultMessage: 'Detailed expected value within this block',
  },
  Required: {
    id: 'required',
    defaultMessage: 'Required',
  },
  DontAllowDeletionOfThisBlock: {
    id: 'dont-allow-deletion-of-this-block',
    defaultMessage: "Don't allow deletion of this block",
  },
  FixedPosition: {
    id: 'fixed-position',
    defaultMessage: 'Fixed position',
  },
  DisableDragDropOnThisBlock: {
    id: 'disable-drag-drop-on-this-block',
    defaultMessage: 'Disable drag & drop on this block',
  },
  DisableNewBlocks: {
    id: 'disable-new-blocks',
    defaultMessage: 'Disable new blocks',
  },
  DisableCreationNewBlocksAfterThisBlock: {
    id: 'disable-creation-of-new-blocks-after-this-block',
    defaultMessage: 'Disable creation of new blocks after this block',
  },
  ReadOnly: {
    id: 'read-only',
    defaultMessage: 'Read-only',
  },
  DisableEditingOnThisBlock: {
    id: 'disable-editing-on-this-block',
    defaultMessage: 'Disable editing on this block',
  },
  ReadOnlySettings: {
    id: 'read-only-settings',
    defaultMessage: 'Read-only settings',
  },
  DisableEditingOnColumnsBlockSettings: {
    id: 'disable-editing-on-columns-block-settings',
    defaultMessage: 'Disable editing on columns block settings',
  },
});

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

const Schema = (config, props, { intl }) => ({
  title: intl.formatMessage(messages.TabsBlockSettings),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.Default),
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
      title: intl.formatMessage(messages.AllowedBlocks),
      description: props.intl.formatMessage(
        messages.AllowOnlyTheFollowingBlocksTypes,
      ),
      type: 'array',
      items: {
        choices: blocksArray(config),
      },
    },
    placeholder: {
      title: intl.formatMessage(messages.HelperText),
      description: props.intl.formatMessage(
        messages.ShortHintThatDescribesTheExpectedValueWithinThisBlock,
      ),
      type: 'string',
    },
    instructions: {
      title: intl.formatMessage(messages.Instructions),
      description: props.intl.formatMessage(
        messages.DetailedExpectedValueWithinThisBlock,
      ),
      type: 'string',
      widget: 'richtext',
    },
    required: {
      title: intl.formatMessage(messages.Required),
      description: props.intl.formatMessage(
        messages.DontAllowDeletionOfThisBlock,
      ),
      type: 'boolean',
    },
    fixed: {
      title: intl.formatMessage(messages.FixedPosition),
      description: props.intl.formatMessage(
        messages.DisableDragDropOnThisBlock,
      ),
      type: 'boolean',
    },
    disableNewBlocks: {
      title: intl.formatMessage(messages.DisableNewBlocks),
      description: props.intl.formatMessage(
        messages.DisableCreationNewBlocksAfterThisBlock,
      ),
      type: 'boolean',
    },
    readOnly: {
      title: intl.formatMessage(messages.ReadOnly),
      description: props.intl.formatMessage(messages.DisableEditingOnThisBlock),
      type: 'boolean',
    },
    readOnlySettings: {
      title: intl.formatMessage(messages.ReadOnlySettings),
      description: props.intl.formatMessage(
        messages.DisableEditingOnColumnsBlockSettings,
      ),
      type: 'boolean',
    },
  },
  required: [],
});

export default injectIntl(Schema);
