import codeSVG from '@plone/volto/icons/code.svg';
import { TabsBlockEdit, TabsBlockView, DefaultTabsRenderer } from './Tabs';
import { TABSBLOCK } from './constants';
import { tabs_block, content, tabs_layout_fix } from './reducers';
import BlockExtensionWidget from './Tabs/BlockExtensionWidget';

export default (config) => {
  config.blocks.blocksConfig[TABSBLOCK] = {
    id: TABSBLOCK,
    title: 'Section',
    icon: codeSVG,
    group: 'text',
    view: TabsBlockView,
    edit: TabsBlockEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
    extensions: [
      {
        id: 'default',
        title: 'Default',
        view: DefaultTabsRenderer,
        schemaExtender: null,
      },
    ],
  };
  config.addonReducers = {
    ...config.addonReducers,
    tabs_block,
    content, // We're overwriting the default content reducer
    tabs_layout_fix,
  };
  config.widgets.widget.block_extension = BlockExtensionWidget;
  return config;
};
