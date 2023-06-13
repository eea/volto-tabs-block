const tabSchema = (props) => {
  // const { data } = props;
  return {
    title: 'Tab',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'image',
          'imageSize',
          'icon',
          'iconSize',
          // 'assetType',
          // ...(data?.blocks?.[tabId]?.assetType === 'image'
          //   ? ['image', 'imageSize']
          //   : []),
          // ...(data?.blocks?.[tabId]?.assetType === 'icon'
          //   ? ['icon', 'iconSize']
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
        defaultValue: 'image',
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
