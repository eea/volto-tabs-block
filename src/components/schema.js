import { cloneDeepSchema } from '@plone/volto/helpers/Utils/Utils';

const tabSchema = (props) => {
  return {
    title: 'Tab',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['title', 'assetPosition', 'assetSize', 'icon', 'image'],
      },
    ],

    properties: {
      title: {
        title: 'Tab title',
      },
      assetPosition: {
        title: 'Asset position',
        choices: [
          ['top', 'Top'],
          ['left', 'Left'],
          ['right', 'Right'],
        ],
        default: 'top',
      },
      image: {
        title: 'Image',
        widget: 'attachedimage',
      },
      assetSize: {
        title: 'Asset size',
        type: 'array',
        choices: [
          ['tiny', 'Tiny'],
          ['small', 'Small'],
          ['medium', 'Medium'],
          ['big', 'Large'],
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
  // console.log('s', schema, child);
  if (child.icon) {
    cloned.fieldsets[0].fields = schema.fieldsets[0].fields.filter(
      (f) => f !== 'image',
    );
  }
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
