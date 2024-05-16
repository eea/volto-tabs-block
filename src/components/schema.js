import { cloneDeepSchema } from '@plone/volto/helpers/Utils/Utils';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  AssetPosition: {
    defaultMessage: 'Asset position',
    id: 'assetPosition',
  },
  AssetSize: {
    defaultMessage: 'Asset size',
    id: 'assetSize',
  },
  AssetType: {
    defaultMessage: 'Asset type',
    id: 'assetType',
  },
  Bottom: {
    defaultMessage: 'Bottom',
    id: 'bottom',
  },
  Default: {
    defaultMessage: 'Default',
    id: 'default',
  },
  Image: {
    defaultMessage: 'Image',
    id: 'image',
  },
  Icon: {
    defaultMessage: 'Icon',
    id: 'icon',
  },
  IconName: {
    defaultMessage: 'Icon name',
    id: 'iconName',
  },
  LeftSide: {
    id: 'left-side',
    defaultMessage: 'Left side',
  },
  RightSide: {
    id: 'right-side',
    defaultMessage: 'Right side',
  },
  Medium: {
    defaultMessage: 'Medium',
    id: 'Medium',
  },
  Middle: {
    defaultMessage: 'Middle',
    id: 'middle',
  },
  Small: {
    id: 'small',
    defaultMessage: 'Small',
  },
  Tabs: {
    defaultMessage: 'Tabs',
    id: 'tabs',
  },
  TabsBlock: {
    defaultMessage: 'Tabs block',
    id: 'tabs-block',
  },
  TabTitle: {
    defaultMessage: 'Tab title',
    id: 'tabTitle',
  },
  Title: {
    defaultMessage: 'Title',
    id: 'title',
  },
  Top: {
    defaultMessage: 'Top',
    id: 'top',
  },
  VerticalAlign: {
    defaultMessage: 'Vertical align',
    id: 'vertical-align',
  },
  Tab: {
    id: 'tab',
    defaultMessage: 'Tab',
  },
  HideTitle: {
    id: 'hideTitle',
    defaultMessage: 'Hide tab title?',
  },
  Large: {
    id: 'large',
    defaultMessage: 'Large',
  },
  Description: {
    id: 'description',
    defaultMessage: 'Description',
  },
  linkToPage: {
    id: 'linkToPage',
    defaultMessage: 'Link to page',
  },
});

const tabSchema = (props) => {
  const intl = props.intl;
  return {
    title: intl.formatMessage(messages.Tab),

    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.Default),
        fields: ['title', 'assetType', 'linkToPage'],
      },
    ],

    properties: {
      title: {
        title: intl.formatMessage(messages.TabTitle),
      },
      linkToPage: {
        title: 'Link page',
        widget: 'url',
      },
      assetType: {
        title: intl.formatMessage(messages.AssetType),
        choices: [
          ['image', intl.formatMessage(messages.Image)],
          ['icon', intl.formatMessage(messages.Icon)],
        ],
      },
      assetPosition: {
        title: intl.formatMessage(messages.AssetPosition),
        choices: [
          ['top', intl.formatMessage(messages.Top)],
          ['left', intl.formatMessage(messages.LeftSide)],
          ['right', intl.formatMessage(messages.RightSide)],
        ],
        default: 'top',
      },
      image: {
        title: intl.formatMessage(messages.Image),
        widget: 'object_browser',
        mode: 'image',
        allowExternals: true,
        selectedItemAttrs: ['image_field', 'image_scales'],
      },
      imageSize: {
        title: intl.formatMessage(messages.AssetSize),
        choices: [
          ['icon', intl.formatMessage(messages.Small)],
          ['tile', intl.formatMessage(messages.Medium)],
          ['thumb', intl.formatMessage(messages.Large)],
        ],
        default: 'icon',
      },
      iconSize: {
        title: intl.formatMessage(messages.AssetSize),
        choices: [
          ['small', intl.formatMessage(messages.Small)],
          ['medium', intl.formatMessage(messages.Medium)],
          ['large', intl.formatMessage(messages.Large)],
        ],
        default: 'small',
      },
      icon: {
        title: intl.formatMessage(messages.IconName),
      },
      hideTitle: {
        title: intl.formatMessage(messages.HideTitle),
        type: 'boolean',
      },
    },

    required: [],
  };
};

const toggleIconField = (schema, child) => {
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

export const blockSchema = (props) => {
  const intl = props.intl;
  return {
    title: intl.formatMessage(messages.TabsBlock),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.Default),
        fields: ['title', 'description', 'verticalAlign', 'data'],
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
        title: intl.formatMessage(messages.Description),
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
