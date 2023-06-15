import { cloneDeepSchema } from '@plone/volto/helpers/Utils/Utils';

const tabSchema = (props) => {
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
        default: 'icon',
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
            See{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://remixicon.com"
            >
              Remix icon cheatsheet
            </a>
          </>
        ),
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
      ? ['icon', 'iconSize', 'assetPosition']
      : []),
    ...(child.assetType === 'image'
      ? ['image', 'imageSize', 'assetPosition']
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
      },
    ],
    properties: {
      data: {
        title: 'Tabs',
        type: 'tabs',
        schema: tabSchema(props),
        schemaExtender: toggleIconField,
      },
      title: {
        title: 'Title',
      },
      description: {
        title: 'Description',
      },
      verticalAlign: {
        title: 'Vertical align',
        type: 'array',
        choices: [
          ['flex-start', 'Top'],
          ['center', 'Middle'],
          ['flex-end', 'Bottom'],
        ],
        default: 'flex-start',
      },
    },
    required: [],
  };
};
