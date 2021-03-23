import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';

export const schema = (config, templateSchema = {}) => {
  const templates = Object.keys(
    config.blocks.blocksConfig[TABS_BLOCK].templates,
  ).map((template) => [template, template]);

  const defaultFieldset = templateSchema.fieldsets.filter(
    (fieldset) => fieldset.id === 'default',
  )[0];

  return {
    title: templateSchema.title || 'Tabs block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'data',
          'template',
          'title',
          ...(defaultFieldset?.fields || {}),
        ],
      },
      ...(templateSchema.fieldsets.filter(
        (fieldset) => fieldset.id !== 'default',
      ) || []),
    ],
    properties: {
      data: {
        title: 'Tabs',
        type: 'tabs',
      },
      template: {
        title: 'Template',
        type: 'array',
        choices: [...templates],
        default: 'default',
      },
      title: {
        title: 'Title',
      },
      ...(templateSchema.properties || {}),
    },
    required: [...(templateSchema.required || [])],
  };
};
