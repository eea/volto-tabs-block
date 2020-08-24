import React from 'react';
import { Tab, Menu } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '@eeacms/volto-tabs-block/actions';
import { blocks } from '~/config';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { getBlocksFieldname, getBaseUrl } from '@plone/volto/helpers';
import { isEqual } from './utils';
import { arrayToTree } from 'performant-array-to-tree';

import './public.less';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const flattenArray = (array, depth = 0) => {
  let flattenedArray = [];
  array.forEach((item) => {
    if (item.children?.length > 0) {
      flattenedArray.push({ ...item, depth });
      flattenedArray = [
        ...flattenedArray,
        ...flattenArray(item.children, depth + 1),
      ];
    } else {
      flattenedArray.push({ ...item, depth });
    }
  });
  return flattenedArray;
};

const hasChildActive = (tabs, tab, activeTabIndex) => {
  const activeTab = tabs[activeTabIndex];
  if (activeTab?.parentTitle === tab?.title) return true;
  if (tab.children) {
    let active = false;
    tab.children.forEach((child) => {
      active = hasChildActive(tabs, child, activeTabIndex);
    });
    return active;
  }
  return false;
};

const isHidden = (tabs, tab, activeTabIndex) => {
  if (!hasChildActive(tabs, tab, activeTabIndex)) {
    const activeTab = tabs[activeTabIndex];
    if (tab.title === activeTab?.title) return false;
    if (tab.parentTitle === activeTab?.title) return false;
    if (tab.depth > 0) return true;
    return false;
  }
  return false;
};

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
  const pathKey = useSelector((state) => state.router.location.key);
  const tabsState = useSelector((state) => state.tabs_block[pathKey] || {});
  const mounted = React.useRef();
  const saved_blocks_layout = React.useRef([]);
  const blocks_layout = properties.blocks_layout?.items;

  const { tabsLayout = [] } = data;
  const globalActiveTab = tabsState[id] || 0;
  const tabs = data.tabs
    ? [
        ...data.tabs.map((tab, index) => ({
          ...tab,
          index,
          id: tab.title,
          parentId:
            tab.parentTitle !== tab.title ? tab.parentTitle || null : null,
        })),
      ]
    : [];

  const orderedTabs = flattenArray(arrayToTree(tabs, { dataField: null }));
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
      dispatch(setActiveTab(id, 0, mode, newTabsState, pathKey));
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
      dispatch(setActiveTab(id, 0, mode, newTabsState, pathKey));
    }
  }, [dispatch, id, mode, tabsState, blocks_layout, pathKey]);

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
              <>
                <Block
                  key={block}
                  id={block}
                  properties={properties}
                  data={properties[blocksFieldname][block]}
                  path={getBaseUrl(location?.pathname || '')}
                />
              </>
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
    [tabsLayout, blocksFieldname, intl, location?.pathname, properties], // TODO: fill in the rest of the array
  );

  const menu = { pointing: true };
  const grid = { paneWidth: 9, tabWidth: 3, stackable: true };
  const position = data?.position || 'top';
  if (mode === 'edit') {
    menu.attached = false;
    menu.tabular = false;
  } else {
    switch (position) {
      case 'top':
        break;
      case 'bottom':
        menu.attached = 'bottom';
        break;
      case 'left':
        menu.fluid = true;
        menu.vertical = true;
        menu.tabular = true;
        break;
      case 'right':
        menu.fluid = true;
        menu.vertical = true;
        menu.tabular = 'right';
        break;
      default:
    }
  }
  return (
    <div className={cx('tabsblock', data.css_class)}>
      <div className="ui container">
        {tabs.length ? (
          <Tab
            grid={grid}
            menu={menu}
            onTabChange={(event, { activeIndex }) => {
              dispatch(setActiveTab(id, activeIndex, mode, tabsState, pathKey));
            }}
            activeIndex={globalActiveTab}
            panes={orderedTabs.map((child, index) => {
              return {
                render: () => mode === 'view' && renderTab(child.index, child),
                menuItem: (
                  <Menu.Item
                    key={`menu-item-${child.index}-${child.title}`}
                    className={`${position} ${mode} ${
                      hasChildActive(orderedTabs, child, globalActiveTab)
                        ? 'active by-child'
                        : ''
                    } ${
                      isHidden(orderedTabs, child, globalActiveTab)
                        ? 'hidden'
                        : ''
                    } depth_${child.depth || 0} `}
                    active={globalActiveTab === index}
                    index={index}
                  >
                    {child.title}
                  </Menu.Item>
                ),
              };
            })}
          />
        ) : (
          <>
            <hr className="block section" />
            {mode === 'view' ? renderTab(0, {}) : ''}
          </>
        )}
      </div>
    </div>
  );
};

export default injectIntl(TabsBlockView);
