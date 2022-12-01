import { messages } from '@eeacms/volto-tabs-block/utils';
import { useIntl } from 'react-intl';

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
const GetSchema = (config) => {
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

export default GetSchema;
