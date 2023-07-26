import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  TabsBlock: {
    id: 'tabs-block',
    defaultMessage: 'Tabs block',
  },
  Default: {
    id: 'default',
    defaultMessage: 'Default',
  },
  Tabs: {
    id: 'tabs',
    defaultMessage: 'Tabs',
  },
  Title: {
    id: 'title',
    defaultMessage: 'Title',
  },
  Template: {
    id: 'template',
    defaultMessage: 'Template',
  },
  VerticalAlign: {
    id: 'vertical-align',
    defaultMessage: 'Vertical align',
  },
  Top: {
    id: 'top',
    defaultMessage: 'Top',
  },
  Middle: {
    id: 'middle',
    defaultMessage: 'Middle',
  },
  Bottom: {
    id: 'bottom',
    defaultMessage: 'Bottom',
  },
  default: {
    id: 'default',
    defaultMessage: 'Default',
  },
  accordionResponsive: {
    id: 'accordionResponsive',
    defaultMessage: 'Accordion responsive',
  },
  horizontalResponsive: {
    id: 'horizontalResponsive',
    defaultMessage: 'Horizontal responsive',
  },
  carouselHorizontal: {
    id: 'carouselHorizontal',
    defaultMessage: 'Carousel horizontal',
  },
  carouselVerticalPrototype: {
    id: 'carouselVerticalPrototype',
    defaultMessage: 'Carousel vertical (prototype)',
  },
});

export const schema = (config, templateSchema = {}, props) => {
  const { intl } = props;
  const templatesConfig = config.blocks.blocksConfig[TABS_BLOCK].templates;
  const templates = Object.keys(templatesConfig).map((template) => {
    let templateTitle = templatesConfig[template].title || template;
    let templateId = templatesConfig[template].id
    if (templateId && messages[`${templateId}`]) {
      templateTitle = intl.formatMessage(messages[`${templateId}`])
    }
    return [template, templateTitle]
  });

  const defaultFieldset = templateSchema?.fieldsets?.filter(
    (fieldset) => fieldset.id === 'default',
  )[0];

  return {
    title: templateSchema?.title || intl.formatMessage(messages.TabsBlock),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.Default),
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
        title: intl.formatMessage(messages.Tabs),
        type: 'tabs',
      },
      title: {
        title: intl.formatMessage(messages.Title),
      },
      template: {
        title: intl.formatMessage(messages.Template),
        choices: [...templates],
        default: 'default',
      },
      verticalAlign: {
        title: intl.formatMessage(messages.VerticalAlign),
        choices: [
          ['flex-start', intl.formatMessage(messages.Top)],
          ['center', intl.formatMessage(messages.Middle)],
          ['flex-end', intl.formatMessage(messages.Bottom)],
        ],
        default: 'flex-start',
      },
      ...(templateSchema?.properties || {}),
    },
    required: [...(templateSchema?.required || [])],
  };
};
