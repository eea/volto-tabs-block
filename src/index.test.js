jest.mock('@eeacms/volto-tabs-block/components', () => ({
  DefaultEdit: () => null,
  DefaultView: () => null,
  AccordionEdit: () => null,
  AccordionView: () => null,
  HorizontalResponsiveEdit: () => null,
  HorizontalResponsiveView: () => null,
  HorizontalCarouselView: () => null,
  VerticalCarouselView: () => null,
  layoutSchema: require('./components/layoutSchema').default,
  TabsEdit: () => null,
  TabsView: () => null,
  blockSchema: jest.fn(),
}), { virtual: true });

jest.mock(
  '@eeacms/volto-tabs-block//icons/tabs.svg',
  () => 'tabs.svg',
  { virtual: true },
);

jest.mock('./widgets', () => ({
  TabsWidget: () => null,
}));

const applyConfig = require('./index').default;
const { TABS_BLOCK } = require('./constants');

describe('applyConfig', () => {
  it('should include tabs in allowed blocks schema choices', () => {
    const config = {
      blocks: {
        blocksConfig: {
          text: { title: 'Text', restricted: false },
          image: { restricted: false },
          image_test: { title: 'Image', restricted: true },
        },
      },
      widgets: {
        type: {},
      },
    };

    const newConfig = applyConfig(config);

    expect(
      newConfig.blocks.blocksConfig[TABS_BLOCK].schema.properties.allowedBlocks
        .items.choices,
    ).toEqual([
      ['text', 'Text'],
      ['image', 'image'],
      [TABS_BLOCK, 'Tabs'],
    ]);
  });
});
