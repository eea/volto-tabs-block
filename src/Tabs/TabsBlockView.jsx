import React from 'react';
import { Tab } from 'semantic-ui-react';
import './public.less';

const TabsBlockView = ({ onTabChange, data, activeIndex, ...rest }) => {
  const { tabs = [{ title: 'Default' }], tabsLayout = [] } = data;
  // console.log('activeTab', activeIndex);
  // console.log('tabsLayout in view', tabsLayout);
  return (
    <div className="children-tabs-view">
      <div id="page-document" className="ui container">
        <Tab
          menu={{ attached: false, tabular: false }}
          panes={tabs.map((child, index) => ({
            menuItem: child.title,
            render: () => (
              <Tab.Pane>
                {(tabsLayout[index] || []).map((id, i) => (
                  <div key={i}>{id}</div>
                ))}
              </Tab.Pane>
            ),
          }))}
          onTabChange={(event, { activeIndex }) => {
            onTabChange && onTabChange(activeIndex);
          }}
          activeIndex={activeIndex}
        />
      </div>
    </div>
  );
};

export default TabsBlockView;
