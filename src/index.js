import codeSVG from '@plone/volto/icons/code.svg';
import { TabsBlockEdit, TabsBlockView, DefaultTabsRenderer } from './Tabs';
import { TABSBLOCK } from './constants';
import { tabs_block, content, tabs_layout_fix } from './reducers';
import BlockExtensionWidget from './Tabs/BlockExtensionWidget';
import installVoltoObjectWidget from '@eeacms/volto-object-widget';

export default (config) => {
  config.blocks.blocksConfig[TABSBLOCK] = {
    id: TABSBLOCK,
    title: 'Tabs section',
    icon: codeSVG,
    group: 'common',
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

  if (Object.keys(config.widgets.widget).indexOf('object') === -1) {
    // depends on volto-object-widget
    config = installVoltoObjectWidget(config);
  }

  return config;
};
