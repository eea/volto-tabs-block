import codeSVG from '@plone/volto/icons/code.svg';
import { TabsBlockEdit, TabsBlockView } from './Tabs';
import { TABSBLOCK } from './constants';
import { tabs_block, content } from './reducers';

export default (config) => {
  config.blocks.blocksConfig[TABSBLOCK] = {
    id: TABSBLOCK,
    title: 'Section',
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
  config.addonReducers = {
    ...config.addonReducers,
    tabs_block,
    content, // We're overwriting the default content reducer
  };
  return config;
};
