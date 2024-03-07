import { defineMessages } from 'react-intl';

import {
  DefaultEdit,
  DefaultView,
  AccordionEdit,
  AccordionView,
  HorizontalResponsiveEdit,
  HorizontalResponsiveView,
  HorizontalCarouselView,
  VerticalCarouselView,
  layoutSchema,
  TabsEdit,
  TabsView,
  blockSchema,
} from '@eeacms/volto-tabs-block/components';

import { TABS_BLOCK } from './constants';
import { TabsWidget } from './widgets';

import tabsSVG from '@eeacms/volto-tabs-block//icons/tabs.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';

defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  accordion: {
    id: 'Accordion responsive',
    defaultMessage: 'Accordion responsive',
  },
  carouselHorizontal: {
    defaultMessage: 'Carousel horizontal',
    id: 'Carousel horizontal',
  },
  carouselVerticalPrototype: {
    defaultMessage: 'Carousel vertical (prototype)',
    id: 'Carousel vertical (prototype)',
  },
  horizontalResponsive: {
    defaultMessage: 'Horizontal responsive',
    id: 'Horizontal responsive',
  },
});

const applyConfig = (config) => {
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
    blockSchema: blockSchema,
    schema: layoutSchema(config),
    variations: [
      {
        id: 'default',
        title: 'Default',
        isDefault: true,
        edit: DefaultEdit,
        view: DefaultView,
        schemaEnhancer: DefaultEdit.schemaEnhancer,
      },
      {
        id: 'accordion',
        title: 'Accordion responsive',
        edit: AccordionEdit,
        view: AccordionView,
        schemaEnhancer: AccordionEdit.schemaEnhancer,
        transformWidth: 800,
        icons: {
          closed: rightSVG,
          opened: downSVG,
          size: '24px',
        },
      },
      {
        id: 'horizontal-responsive',
        title: 'Horizontal responsive',
        edit: HorizontalResponsiveEdit,
        view: HorizontalResponsiveView,
        schemaEnhancer: HorizontalResponsiveEdit.schemaEnhancer,
      },
      {
        id: 'carousel-horizontal',
        title: 'Carousel horizontal',
        edit: DefaultEdit,
        view: HorizontalCarouselView,
        schemaEnhancer: HorizontalCarouselView.schemaEnhancer,
      },
      {
        id: 'carousel-vertical',
        title: 'Carousel vertical (prototype)',
        edit: DefaultEdit,
        view: VerticalCarouselView,
        schemaEnhancer: VerticalCarouselView.schemaEnhancer,
      },
    ],
    getBlocks: (data) => {
      const { blocks = {}, blocks_layout = {} } = data?.data || {};
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

export default applyConfig;
