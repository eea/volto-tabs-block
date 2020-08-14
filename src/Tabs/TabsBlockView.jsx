import React from 'react';
import { Tab } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from 'volto-tabsblock/actions';

import './public.less';

const TabsBlockView = ({ id, onTabChange, data, mode = 'view', ...rest }) => {
  const dispatch = useDispatch();
  const { tabs = [], tabsLayout = [] } = data;
  const activeTab = useSelector((state) => {
    return state.tabs_block[id] || 0;
  });
  return (
    <div className="children-tabs-view">
      <div id="page-document" className="ui container">
        {tabs.length ? (
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
                  <h5>All blocks</h5>
                  <ol>
                    {Object.entries(rest.properties.blocks).map(
                      ([id, block]) => (
                        <li key={id}>
                          {block['@type']} - {id}
                        </li>
                      ),
                    )}
                  </ol>
                </Tab.Pane>
              ),
            }))}
            onTabChange={(event, { activeIndex }) => {
              dispatch(setActiveTab(id, activeIndex, mode));
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
