import applyConfig from './index';
import { TABS_BLOCK } from './constants';

vi.mock('./components', async () => ({
  DefaultEdit: () => null,
  DefaultView: () => null,
  AccordionEdit: () => null,
  AccordionView: () => null,
  HorizontalResponsiveEdit: () => null,
  HorizontalResponsiveView: () => null,
  HorizontalCarouselView: () => null,
  VerticalCarouselView: () => null,
  layoutSchema: (await vi.importActual('./components/layoutSchema')).default,
  TabsEdit: () => null,
  TabsView: () => null,
  blockSchema: vi.fn(),
}));

vi.mock('./widgets', () => ({
  TabsWidget: () => null,
}));

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
