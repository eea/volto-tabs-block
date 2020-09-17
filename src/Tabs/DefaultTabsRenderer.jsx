import React from 'react';
import { Tab } from 'semantic-ui-react';
import { blocks } from '~/config';
import { getBaseUrl } from '@plone/volto/helpers';
import { useIntl, defineMessages } from 'react-intl';
import { getBlocksFieldname } from '@plone/volto/helpers';

export const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const GRID = { paneWidth: 9, tabWidth: 3, stackable: true };

export const getMenu = (props) => {
  const { data, mode } = props;
  const menu = { pointing: true };
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
};

const DefaultTabsRenderer = (props) => {
  const {
    tabsLayout,
    globalActiveTab,
    mode,
    properties,
    pathname,
    onTabChange,
    tabs,
  } = props;

  const intl = useIntl();

  const blocksFieldname = getBlocksFieldname(properties);

  const renderTab = React.useCallback(
    ({
      index,
      tab,
      tabsLayout,
      properties,
      intl,
      blocksFieldname,
      pathname,
    }) => {
      const blockIds = tabsLayout[index] || [];
      const blocklist = blockIds.map((blockId) => {
        return [blockId, properties[blocksFieldname]?.[blockId]];
      });
      return (
        <Tab.Pane>
          {blocklist.map(([blockId, blockData]) => {
            const Block = blocks.blocksConfig[blockData['@type']]?.view;
            return Block !== null ? (
              <>
                <Block
                  key={blockId}
                  id={blockId}
                  properties={properties}
                  data={blockData}
                  path={getBaseUrl(pathname || '')}
                />
              </>
            ) : (
              <div key={blockId}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: blockData?.['@type'],
                })}
              </div>
            );
          })}
        </Tab.Pane>
      );
    },
    [],
  );
  const menu = getMenu(props);
  const tabRenderer = props.renderTab || renderTab;

  return tabs.length ? (
    <Tab
      grid={GRID}
      menu={menu}
      onTabChange={onTabChange}
      activeIndex={globalActiveTab}
      panes={tabs.map((tab, index) => ({
        // render: () => mode === 'view' && renderTab(index, child),
        render: () =>
          mode === 'view' &&
          tabRenderer({
            index,
            tab,
            tabsLayout,
            properties,
            intl,
            blocksFieldname,
            pathname,
          }),
        menuItem: tab.title,
      }))}
    />
  ) : (
    <>
      <hr className="block section" />
      {mode === 'view'
        ? tabRenderer({
            index: 0,
            tab: {},
            tabsLayout,
            properties,
            intl,
            blocksFieldname,
            pathname,
          })
        : ''}
    </>
  );
};

export default DefaultTabsRenderer;
