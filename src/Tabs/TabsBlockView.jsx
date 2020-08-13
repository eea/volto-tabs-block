import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from 'volto-tabsblock/actions';

import './public.less';

const TabsBlockView = ({ id, onTabChange, data, ...rest }) => {
  const dispatch = useDispatch();
  const { tabs = [{ title: 'Default' }], tabsLayout = [] } = data;
  const activeTab = useSelector((state) => {
    return state.tabs_block[id] || 0;
  });
  return (
    <div className="children-tabs-view">
      <div id="page-document" className="ui container">
        <Tab
          menu={{ attached: false, tabular: false }}
          panes={tabs.map((child, index) => ({
            menuItem: child.title,
            render: () => (
              <Tab.Pane>
                <ol>
                  {(tabsLayout[index] || []).map((id, i) => (
                    <li key={i}>{id}</li>
                  ))}
                </ol>
              </Tab.Pane>
            ),
          }))}
          onTabChange={(event, { activeIndex }) => {
            dispatch(setActiveTab(id, activeIndex));
            // onTabChange && onTabChange(activeIndex);
          }}
          activeIndex={activeTab}
        />
      </div>
    </div>
  );
};

export default TabsBlockView;
