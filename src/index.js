import { TabsEdit, TabsView } from '@eeacms/volto-tabs-block/components';
import {
  DefaultEdit,
  DefaultView,
  HorizontalCarouselView,
  VerticalCarouselView,
  defaultSchema,
  carouselSchema,
} from '@eeacms/volto-tabs-block/components';
import { layoutSchema } from '@eeacms/volto-tabs-block/components';
import { TABS_BLOCK } from './constants';
import { TabsWidget } from './widgets';

import tabsSVG from '@eeacms/volto-tabs-block//icons/tabs.svg';

export default (config) => {
  config.blocks.blocksConfig[TABS_BLOCK] = {
    id: TABS_BLOCK,
    title: 'Tabs block',
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
      carousel: {
        title: 'Carousel horizontal',
        edit: DefaultEdit,
        view: HorizontalCarouselView,
        schema: carouselSchema,
      },
      carousel_vertical: {
        title: 'Carousel vertical',
        edit: DefaultEdit,
        view: VerticalCarouselView,
        schema: carouselSchema,
      },
    },
    getBlocks: (data) => {
      const { blocks = {}, blocks_layout = {} } = data?.data;
      if (blocks_layout?.items?.length) {
        return {
          blocks: blocks_layout.items.map((block, index) => ({
            title: blocks[block]['title'] || `Tab ${index + 1}`,
            id: block,
            type: TABS_BLOCK,
          })),
        };
      }
      return {};
    },
  };

  config.widgets.type.tabs = TabsWidget;

  config.settings.hashlinkBlacklist = [
    ...(config.settings.hashlinkBlacklist || []),
    TABS_BLOCK,
  ];

  return config;
};
