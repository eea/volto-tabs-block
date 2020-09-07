import React from 'react';
import { Tab } from 'semantic-ui-react';
import { blocks } from '~/config';
import { getBaseUrl } from '@plone/volto/helpers';
import { useIntl, defineMessages } from 'react-intl';
import { getBlocksFieldname } from '@plone/volto/helpers';

const messages = defineMessages({
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
    (index, tab) => {
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
    [tabsLayout, intl, blocksFieldname, pathname, properties], // TODO: fill in the rest of the array
  );
  const menu = getMenu(props);

  return tabs.length ? (
    <Tab
      grid={GRID}
      menu={menu}
      onTabChange={onTabChange}
      activeIndex={globalActiveTab}
      panes={tabs.map((child, index) => ({
        render: () => mode === 'view' && renderTab(index, child),
        menuItem: child.title,
      }))}
    />
  ) : (
    <>
      <hr className="block section" />
      {mode === 'view' ? renderTab(0, {}) : ''}
    </>
  );
};

export default DefaultTabsRenderer;
