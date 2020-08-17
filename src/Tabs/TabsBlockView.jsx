import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from 'volto-tabsblock/actions';
import { blocks } from '~/config';
import { defineMessages, injectIntl } from 'react-intl';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
  getBaseUrl,
} from '@plone/volto/helpers';

import './public.less';
// import { connect } from 'react-redux';
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

  const { tabs = [], tabsLayout = [] } = data;
  const globalActiveTab = tabsState[id] || 0;

  React.useEffect(() => {
    if (!mounted.current && mode === 'view') {
      const newTabsState = {};
      Object.keys(tabsState).forEach((blockid) => {
        newTabsState[blockid] = 0;
      });
      dispatch(setActiveTab(id, 0, mode, newTabsState));
      mounted.current = true;
    }
  }, [dispatch, id, mode, tabsState]);

  const blocksFieldname = getBlocksFieldname(properties);

  const renderTab = React.useCallback(
    (index, tab) => {
      const blockIds = tabsLayout[index] || [];
      return blockIds.map((block) => {
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
      });
    },
    [tabsLayout],
  );

  return (
    <div className="children-tabs-view">
      <div id="page-document" className="ui container">
        {tabs.length ? (
          <Tab
            menu={{ attached: false, tabular: false }}
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
