import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from 'volto-tabsblock/actions';

import './public.less';

const TabsBlockView = ({ id, onTabChange, data, mode = 'view', ...rest }) => {
  const dispatch = useDispatch();
  const { tabs = [] } = data;
  const tabsState = useSelector((state) => state.tabs_block);
  const activeTab = tabsState[id] || 0;
  const mounted = React.useRef();

  React.useEffect(() => {
    // console.log('mounted', mounted.current);
    if (!mounted.current && mode === 'view') {
      // console.log('remount');
      const newTabsState = {};
      Object.keys(tabsState).forEach((blockid) => {
        newTabsState[blockid] = 0;
      });
      dispatch(setActiveTab(id, 0, mode, newTabsState));
      mounted.current = true;
    }
  });

  return (
    <div className="children-tabs-view">
      <div id="page-document" className="ui container">
        {tabs.length ? (
          <Tab
            menu={{ attached: false, tabular: false }}
            panes={tabs.map((child, index) => ({
              menuItem: child.title,
            }))}
            onTabChange={(event, { activeIndex }) => {
              dispatch(setActiveTab(id, activeIndex, mode, tabsState));
            }}
            activeIndex={activeTab}
          />
        ) : (
          <div>No tabs defined</div>
        )}
      </div>
    </div>
  );
};

export default TabsBlockView;
