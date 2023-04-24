import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Menu, Tab, Container } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { RenderBlocks } from '@plone/volto/components';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import {
  SimpleMarkdown,
  getMenuPosition,
} from '@eeacms/volto-tabs-block/utils';

import '@eeacms/volto-tabs-block/less/menu.less';

import noop from 'lodash/noop';

const MenuItem = (props) => {
  const {
    activeTab = null,
    tabs = {},
    setActiveTab = noop,
    tabsTitle,
    tabsDescription,
    blockId,
  } = props;

  const { tab, index } = props;
  const title = tabs[tab].title;
  const tabIndex = index + 1;

  const [tabChanged, setTabChanged] = useState(false);
  const defaultTitle = `Tab ${tabIndex}`;

  useEffect(() => {
    if (
      tabChanged === true &&
      document?.getElementById(blockId)?.querySelector('#tab-pane-' + tab)
    ) {
      document
        .getElementById(blockId)
        .querySelector('#tab-pane-' + tab)
        .focus();
      setTabChanged(false);
    }
  }, [tabChanged, tab, blockId]);
  return (
    <React.Fragment>
      {index === 0 && (tabsTitle || tabsDescription) && (
        <Menu.Item className="menu-title">
          <SimpleMarkdown md={tabsTitle} defaultTag="##" className="title" />
          <SimpleMarkdown md={tabsDescription} className="description" />
        </Menu.Item>
      )}
      <Menu.Item
        name={defaultTitle}
        active={tab === activeTab}
        tabIndex={0}
        onClick={() => {
          if (activeTab !== tab) {
            setActiveTab(tab);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (activeTab !== tab) {
              setActiveTab(tab);
            }
            setTabChanged(true);
          }
        }}
      >
        <span className={'menu-item-count'}>{tabIndex}</span>
        <p className={'menu-item-text'}>{title || defaultTitle}</p>
      </Menu.Item>
    </React.Fragment>
  );
};

const View = (props) => {
  const {
    metadata = {},
    data = {},
    tabsList = [],
    tabs = {},
    activeTabIndex = 0,
  } = props;
  const [menuPosition, setMenuPosition] = React.useState({});

  React.useEffect(() => {
    if (Object.keys(menuPosition).length === 0) {
      setMenuPosition(getMenuPosition(data));
    }
  }, [data, menuPosition]);

  const isContainer = data.align === 'full';
  const tabsTitle = data.title;
  const tabsDescription = data.description;

  const schema = React.useMemo(
    () =>
      config.blocks.blocksConfig[TABS_BLOCK].templates?.['default']?.schema(
        config,
        props,
      ) || {},
    [props],
  );

  const getDataValue = React.useCallback(
    (key) => {
      return (
        (schema.properties[key]?.value || data[key]) ??
        schema.properties[key]?.defaultValue
      );
    },
    [schema, data],
  );

  const panes = tabsList.map((tab, index) => {
    return {
      id: tab,
      menuItem: (
        <MenuItem
          {...props}
          key={tab}
          tab={tab}
          index={index}
          tabsTitle={tabsTitle}
          tabsDescription={tabsDescription}
          blockId={props?.id || ''}
        />
      ),
      pane: (
        <Tab.Pane as={isContainer ? Container : undefined}>
          <div tabIndex={0} role="tabpanel" id={'tab-pane-' + tab}>
            <RenderBlocks {...props} metadata={metadata} content={tabs[tab]} />
          </div>
        </Tab.Pane>
      ),
    };
  });

  return (
    <>
      <Tab
        activeIndex={activeTabIndex}
        className="default tabs tabs-accessibility"
        renderActiveOnly={false}
        menu={{
          attached: menuPosition.attached,
          borderless: getDataValue('menuBorderless'),
          color: getDataValue('menuColor'),
          compact: getDataValue('menuCompact'),
          fluid: getDataValue('menuFluid'),
          inverted: getDataValue('menuInverted'),
          pointing: getDataValue('menuPointing'),
          secondary: getDataValue('menuSecondary'),
          size: getDataValue('menuSize'),
          stackable: getDataValue('menuStackable'),
          tabular: getDataValue('menuTabular'),
          text: getDataValue('menuText'),
          vertical: menuPosition.vertical,
          className: cx(
            data.menuAlign,
            menuPosition.direction === 'left' ? 'border-right' : '',
            menuPosition.direction === 'right' ? 'border-left' : '',
            menuPosition.direction === 'top' ? 'border-bottom' : '',
            menuPosition.direction === 'bottom' ? 'border-top' : '',
            { container: isContainer },
          ),
        }}
        menuPosition={menuPosition.direction}
        panes={panes}
        grid={{ paneWidth: 9, tabWidth: 3 }}
      />
    </>
  );
};

export default compose(withScrollToTarget)(withRouter(View));
