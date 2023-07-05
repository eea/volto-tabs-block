import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';

export const schema = (config, templateSchema = {}) => {
  const templatesConfig = config.blocks.blocksConfig[TABS_BLOCK].templates;
  const templates = Object.keys(templatesConfig).map((template) => [
    template,
    templatesConfig[template].title || template,
  ]);

  const defaultFieldset = templateSchema?.fieldsets?.filter(
    (fieldset) => fieldset.id === 'default',
  )[0];

  return {
    title: templateSchema?.title || 'Tabs block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'data',
          'title',
          'template',
          'verticalAlign',
          ...(defaultFieldset?.fields || []),
        ],
      },
      ...(templateSchema?.fieldsets?.filter(
        (fieldset) => fieldset.id !== 'default',
      ) || []),
    ],
    properties: {
      data: {
        title: 'Tabs',
        type: 'tabs',
      },
      title: {
        title: 'Title',
      },
      template: {
        title: 'Template',
        choices: [...templates],
        default: 'default',
      },
      verticalAlign: {
        title: 'Vertical align',
        choices: [
          ['flex-start', 'Top'],
          ['center', 'Middle'],
          ['flex-end', 'Bottom'],
        ],
        default: 'flex-start',
      },
      ...(templateSchema?.properties || {}),
    },
    required: [...(templateSchema?.required || [])],
  };
};
