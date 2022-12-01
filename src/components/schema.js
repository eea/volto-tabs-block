import { useIntl } from 'react-intl';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { messages } from '@eeacms/volto-tabs-block/utils';
export const Schema = (config, templateSchema = {}) => {
  const templatesConfig = config.blocks.blocksConfig[TABS_BLOCK].templates;
  const templates = Object.keys(templatesConfig).map((template) => [
    template,
    templatesConfig[template].title || template,
  ]);

  const defaultFieldset = templateSchema?.fieldsets?.filter(
    (fieldset) => fieldset.id === 'default',
  )[0];
  const intl = useIntl();

  return {
    title: templateSchema?.title || intl.formatMessage(messages.tabsBlock),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.default),
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
        title: intl.formatMessage(messages.tabs),
        type: 'tabs',
      },
      title: {
        title: intl.formatMessage(messages.title),
      },
      template: {
        title: intl.formatMessage(messages.template),
        type: 'array',
        choices: [...templates],
        default: 'default',
      },
      verticalAlign: {
        title: intl.formatMessage(messages.verticalAlign),
        type: 'array',
        choices: [
          ['flex-start', intl.formatMessage(messages.top)],
          ['center', intl.formatMessage(messages.middle)],
          ['flex-end', intl.formatMessage(messages.bottom)],
        ],
        default: 'flex-start',
      },
      ...(templateSchema?.properties || {}),
    },
    required: [...(templateSchema?.required || [])],
  };
};
