import codeSVG from '@plone/volto/icons/code.svg';
import { TabsBlockEdit, TabsBlockView } from './Tabs';
import { TABSBLOCK } from './constants';
import { tabs_block } from './reducers';

export default (config) => {
  config.blocks.blocksConfig[TABSBLOCK] = {
    id: TABSBLOCK,
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
  config.addonReducers.tabs_block = tabs_block;
  return config;
};
