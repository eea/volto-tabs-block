import React from 'react';
import { Tab } from 'semantic-ui-react';
import './public.less';

const TabsBlockView = ({ onTabChange, data, activeIndex, ...rest }) => {
  const { tabs = [{ title: 'Default' }] } = data;
  console.log('activeTab', activeIndex);
  return (
    <div className="children-tabs-view">
      <div id="page-document" className="ui container">
        <Tab
          menu={{ attached: false, tabular: false }}
          panes={tabs.map((child) => ({
            menuItem: child.title,
            render: () => '',
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
