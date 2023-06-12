// import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';

const tabSchema = (props) => {
  return {
    title: 'Tab',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'assetType',
          'image',
          'imageSize',
          // ...(assetType === 'image'
          //   ? [{ id: 'image', title: 'Image', fields: ['image', 'imageSize'] }]
          //   : []),
          // ...(assetType === 'icon'
          //   ? [
          //       {
          //         id: 'icon',
          //         title: 'Icon',
          //         fields: ['icon', 'iconSize'],
          //       },
          //     ]
          //   : []),
        ],
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
        default: 'image',
      },
      image: {
        title: 'Image',
        widget: 'attachedimage',
      },
      imageSize: {
        title: 'Image size',
        choices: [
          ['tiny', 'Tiny'],
          ['small', 'Small'],
          ['medium', 'Medium'],
          ['big', 'Large'],
          ['preview', 'Preview'],
        ],
        default: 'big',
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
      iconSize: {
        title: 'Icon size',
        choices: [
          ['tiny', 'Tiny'],
          ['small', 'Small'],
          ['medium', 'Medium'],
          ['big', 'Large'],
        ],
        default: 'big',
      },
    },

    required: [],
  };
};

export const schema = (config, templateSchema = {}) => {
  // const templatesConfig = config.blocks.blocksConfig[TABS_BLOCK].variations;
  // const templates = Object.keys(templatesConfig).map((template) => [
  //   template,
  //   templatesConfig[template].title || template,
  // ]);

  // const defaultFieldset = templateSchema?.fieldsets?.filter(
  //   (fieldset) => fieldset.id === 'default',
  // )[0];

  return {
    title: templateSchema?.title || 'Tabs block',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'verticalAlign', 'data'],
      },
    ],
    properties: {
      data: {
        title: 'Tabs',
        type: 'tabs',
        schema: tabSchema,
      },
      title: {
        title: 'Title',
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
