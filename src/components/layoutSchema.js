import { TABS_BLOCK } from '../constants';

const blocksArray = (config) => {
  const choices = Object.keys(config.blocks.blocksConfig)
    .map((key) => {
      if (config.blocks.blocksConfig[key]?.restricted) {
        return false;
      } else {
        const title = config.blocks.blocksConfig[key]?.title || key;
        return [key, title];
      }
    })
    .filter((val) => !!val);

  if (!choices.some(([id]) => id === TABS_BLOCK)) {
    choices.push([TABS_BLOCK, 'Tabs']);
  }

  return choices;
};

const layoutSchema = (config) => ({
  title: 'Tabs block settings',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
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
      title: 'Allowed blocks',
      description: 'Allow only the following blocks types',
      type: 'array',
      items: {
        choices: blocksArray(config),
      },
    },
    placeholder: {
      title: 'Helper text',
      description:
        'A short hint that describes the expected value within this block',
      type: 'string',
    },
    instructions: {
      title: 'Instructions',
      description: 'Detailed expected value within this block',
      type: 'string',
      widget: 'richtext',
    },
    required: {
      title: 'Required',
      description: "Don't allow deletion of this block",
      type: 'boolean',
    },
    fixed: {
      title: 'Fixed position',
      description: 'Disable drag & drop on this block',
      type: 'boolean',
    },
    disableNewBlocks: {
      title: 'Disable new blocks',
      description: 'Disable creation of new blocks after this block',
      type: 'boolean',
    },
    readOnly: {
      title: 'Read-only',
      description: 'Disable editing on this block',
      type: 'boolean',
    },
    readOnlySettings: {
      title: 'Read-only settings',
      description: 'Disable editing on tabs block settings',
      type: 'boolean',
    },
  },
  required: [],
});

export default layoutSchema;
