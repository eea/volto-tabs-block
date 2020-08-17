import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from 'volto-tabsblock/actions';
import { blocks } from '~/config';
import { defineMessages, injectIntl } from 'react-intl';
import {
  getBlocksFieldname,
  // getBlocksLayoutFieldname,
  // hasBlocksData,
  getBaseUrl,
} from '@plone/volto/helpers';
import { isEqual } from './utils';

import './public.less';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const TabsBlockView = ({
  id,
  onTabChange,
  data,
  mode = 'view',
  properties,
  intl,
  location,
  ...rest
}) => {
  const dispatch = useDispatch();
  const tabsState = useSelector((state) => state.tabs_block);
  const mounted = React.useRef();
  const saved_blocks_layout = React.useRef([]);
  const blocks_layout = properties.blocks_layout?.items;

  const { tabs = [], tabsLayout = [] } = data;
  const globalActiveTab = tabsState[id] || 0;

  // We have the following "racing" condition:
  // The tabsblockview is mounted sometime before the GET_CONTENT_SUCCESS
  // action is triggered, so even if we "fix" the display,
  // the global state.data.blocks_layout will be overwritten with the "wrong"
  // content. So we need to watch if the blocks_layout is rewritten, to trigger
  // the tab change again
  React.useEffect(() => {
    if (!mounted.current && mode === 'view') {
      const newTabsState = {};
      Object.keys(tabsState).forEach((blockid) => {
        newTabsState[blockid] = 0;
      });
      dispatch(setActiveTab(id, 0, mode, newTabsState));
      mounted.current = true;
    }
    if (
      mode === 'view' &&
      !isEqual(blocks_layout, saved_blocks_layout.current)
    ) {
      const newTabsState = {};
      saved_blocks_layout.current = blocks_layout;
      Object.keys(tabsState).forEach((blockid) => {
        newTabsState[blockid] = 0;
      });
      dispatch(setActiveTab(id, 0, mode, newTabsState));
    }
  }, [dispatch, id, mode, tabsState, blocks_layout]);

  const blocksFieldname = getBlocksFieldname(properties);

  const renderTab = React.useCallback(
    (index, tab) => {
      const blockIds = tabsLayout[index] || [];
      return (
        <Tab.Pane>
          {blockIds.map((block) => {
            const Block =
              blocks.blocksConfig[
                properties[blocksFieldname]?.[block]?.['@type']
              ]?.['view'] || null;
            return Block !== null ? (
              <Block
                key={block}
                id={block}
                properties={properties}
                data={properties[blocksFieldname][block]}
                path={getBaseUrl(location?.pathname || '')}
              />
            ) : (
              <div key={block}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: properties[blocksFieldname]?.[block]?.['@type'],
                })}
              </div>
            );
          })}
        </Tab.Pane>
      );
    },
    [tabsLayout],
  );
  //
  return (
    <div className="children-tabs-view">
      <div id="page-document" className="ui container">
        {tabs.length ? (
          <Tab
            grid={{ paneWidth: 8, tabWidth: 4 }}
            menu={
              mode === 'view'
                ? {
                    fluid: true,
                    vertical: true,
                    tabular: true,
                  }
                : { attached: false, tabular: false }
            }
            onTabChange={(event, { activeIndex }) => {
              dispatch(setActiveTab(id, activeIndex, mode, tabsState));
            }}
            activeIndex={globalActiveTab}
            panes={tabs.map((child, index) => ({
              render: () => mode === 'view' && renderTab(index, child),
              menuItem: child.title,
            }))}
          />
        ) : (
          <hr />
        )}
      </div>
    </div>
  );
};

export default injectIntl(TabsBlockView);
// export default connect( (state, props) => { })(TabsBlockView);
