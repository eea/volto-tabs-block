import codeSVG from '@plone/volto/icons/code.svg';
import { TabsBlockEdit, TabsBlockView } from './Tabs';

export default (config) => {
  config.blocks.blocksConfig.tabsBlock = {
    id: 'tabsBlock',
    title: 'Tabs',
    icon: codeSVG,
    group: 'text',
    view: TabsBlockView,
    edit: TabsBlockEdit,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
