import {
  DefaultEdit,
  DefaultView,
  AccordionEdit,
  AccordionView,
  HorizontalResponsiveView,
  HorizontalCarouselView,
  VerticalCarouselView,
  defaultSchema,
  accordionSchema,
  horizontalResponsiveSchema,
  carouselSchema,
  layoutSchema,
  TabsEdit,
  TabsView,
} from '@eeacms/volto-tabs-block/components';
import { TABS_BLOCK } from './constants';
import { TabsWidget } from './widgets';

import tabsSVG from '@eeacms/volto-tabs-block//icons/tabs.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';

export default (config) => {
  config.blocks.blocksConfig[TABS_BLOCK] = {
    id: TABS_BLOCK,
    title: 'Tabs',
    icon: tabsSVG,
    group: 'common',
    edit: TabsEdit,
    view: TabsView,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    blockHasOwnFocusManagement: true,
    schema: layoutSchema(config),
    templates: {
      default: {
        title: 'Default',
        edit: DefaultEdit,
        view: DefaultView,
        schema: defaultSchema,
      },
      accordion: {
        title: 'Accordion responsive',
        edit: AccordionEdit,
        view: AccordionView,
        schema: accordionSchema,
        transformWidth: 800,
        icons: {
          closed: rightSVG,
          opened: downSVG,
          size: '24px',
        },
      },
      'horizontal-responsive': {
        title: 'Horizontal responsive',
        edit: DefaultEdit,
        view: HorizontalResponsiveView,
        schema: horizontalResponsiveSchema,
      },
      carousel: {
        title: 'Carousel horizontal',
        edit: DefaultEdit,
        view: HorizontalCarouselView,
        schema: carouselSchema,
      },
      carousel_vertical: {
        title: 'Carousel vertical (prototype)',
        edit: DefaultEdit,
        view: VerticalCarouselView,
        schema: carouselSchema,
      },
      ...(config.blocks.blocksConfig[TABS_BLOCK]?.templates || {}),
    },
    getBlocks: (data) => {
      const { blocks = {}, blocks_layout = {} } = data?.data;
      if (blocks_layout?.items?.length) {
        return {
          blocks: blocks_layout.items.map((block, index) => ({
            title: blocks[block]['title'] || `Tab ${index + 1}`,
            id: block,
            parentId: data.parentId,
            type: TABS_BLOCK,
          })),
        };
      }
      return {};
    },
  };

  config.widgets.type.tabs = TabsWidget;

  return config;
};
