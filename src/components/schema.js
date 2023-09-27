import { cloneDeepSchema } from '@plone/volto/helpers/Utils/Utils';

const tabSchema = (props) => {
  return {
    title: 'Tab',
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { defineMessages } from 'react-intl';

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'assetType'],
      },
    ],
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
    let templateId = templatesConfig[template].id;
    if (templateId && messages[`${templateId}`]) {
      templateTitle = intl.formatMessage(messages[`${templateId}`]);
    }
    return [template, templateTitle];
  });

      return {
        title: 'Tab',

        fieldsets: [
          {
            id: 'default',
            title: 'Default',
            fields: ['title', 'assetType'],
          },
        ],

    properties: {
      title: {
        title: 'Tab title',
      },
      assetType: {
        title: 'Asset type',
        choices: [
          ['image', 'Image'],
          ['icon', 'Icon'],
        ],
      },
      assetPosition: {
        title: 'Asset position',
        choices: [
          ['top', 'Top'],
          ['left', 'Left side'],
          ['right', 'Right side'],
        ],
        default: 'top',
      },
      image: {
        title: 'Image',
        widget: 'attachedimage',
      },
      imageSize: {
        title: 'Asset size',
        choices: [
          ['tiny', 'Tiny'],
          ['small', 'Small'],
          ['medium', 'Medium'],
          ['big', 'Large'],
          ['preview', 'Preview'],
        ],
        default: 'big',
      },
      iconSize: {
        title: 'Asset size',
        choices: [
          ['mini', 'Mini'],
          ['tiny', 'Tiny'],
          ['small', 'Small'],
          ['big', 'Big'],
          ['huge', 'Huge'],
          ['massive', 'Massive'],
        ],
        default: 'small',
      },
      icon: {
        title: 'Icon name',
        description: (
          <>
            Ex. ri-home-line. See{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://remixicon.com/"
            >
              Remix Icon set
            </a>
          </>
        ),
      },
      hideTitle: {
        title: 'Hide tab title?',
        type: 'boolean',
        defaultValue: false,
      },
    },

    required: [],
  };
};

const toggleIconField = (schema, child, intl) => {
  const cloned = cloneDeepSchema(schema);

  cloned.fieldsets[0].fields = [
    ...cloned.fieldsets[0].fields,
    ...(child.assetType === 'icon'
      ? ['icon', 'iconSize', 'assetPosition', 'hideTitle']
      : []),
    ...(child.assetType === 'image'
      ? ['image', 'imageSize', 'assetPosition', 'hideTitle']
      : []),
  ];

  return cloned;
};

export const schema = (props) => {
  return {
    title: 'Tabs block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'description', 'verticalAlign', 'data'],
        title: intl.formatMessage(messages.Default),
        fields: [
          'data',
          'title',
          'template',
          'verticalAlign',
          ...(defaultFieldset?.fields || []),
        ],
      },
    ],
    properties: {
      data: {
        title: intl.formatMessage(messages.Tabs),
        type: 'tabs',
        schema: tabSchema(props),
        schemaExtender: toggleIconField,
      },
      title: {
        title: intl.formatMessage(messages.Title),
      },
      description: {
        title: 'Description',
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
    },
    required: [],
  };
};
