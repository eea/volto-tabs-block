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

const messages = defineMessages({
  Tabs: {
    id: 'tabs',
    defaultMessage: 'Tabs',
  },
  Default: {
    id: 'default',
    defaultMessage: 'Default',
  },
  AccordionResponsive: {
    id: 'accordion-responsive',
    defaultMessage: 'Accordion responsive',
  },
  HorizontalResponsive: {
    id: 'horizontal-responsive',
    defaultMessage: 'Horizontal responsive',
  },
  CarouselHorizontal: {
    id: 'carousel-horizontal',
    defaultMessage: 'Carousel horizontal',
  },
  CarouselVertical: {
    id: 'carousel-vertical',
    defaultMessage: 'Carousel vertical (prototype)',
  },
  DefaultTitle: {
    id: 'default-title',
    defaultMessage: 'Tab {tabTitle}',
  },
});

export default (config) => {
  config.blocks.blocksConfig[TABS_BLOCK] = {
    id: TABS_BLOCK,
    title: intl.formatMessage(messages.Tabs),
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
        title: intl.formatMessage(messages.Default),
        edit: DefaultEdit,
        view: DefaultView,
        schema: defaultSchema,
      },
      accordion: {
        title: intl.formatMessage(messages.AccordionResponsive),
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
        title: intl.formatMessage(messages.HorizontalResponsive),
        edit: HorizontalResponsiveEdit,
        view: HorizontalResponsiveView,
        schema: horizontalResponsiveSchema,
      },
      carousel: {
        title: intl.formatMessage(messages.CarouselHorizontal),
        edit: DefaultEdit,
        view: HorizontalCarouselView,
        schema: carouselSchema,
      },
      carousel_vertical: {
        title: intl.formatMessage(messages.CarouselVertical),
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
            title: blocks[block]['title'] || intl.formatMessage(messages.DefaultTitle, { tabTitle: `${index + 1}` }),
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
