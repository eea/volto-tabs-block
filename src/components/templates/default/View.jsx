import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Menu, Tab, Container, Button } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { RenderBlocks } from '@plone/volto/components';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import {
  SimpleMarkdown,
  getMenuPosition,
} from '@eeacms/volto-tabs-block/utils';

import '@eeacms/volto-tabs-block/less/menu.less';

const MenuItem = (props) => {
  const {
    activeTab = null,
    activeTabMenu = null,
    tabs = {},
    setActiveTab = () => {},
    setActiveTabMenu = () => {},
    setEnterMode = () => {},
    tabsTitle,
    tabsDescription,
  } = props;

  const { tab, index } = props;
  const title = tabs[tab].title;
  const tabIndex = index + 1;

  const defaultTitle = `Tab ${tabIndex}`;

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
        active={tab === activeTabMenu}
        onClick={() => {
          if (activeTab !== tab) {
            setActiveTab(tab);
          }
          if (activeTabMenu !== tab) setActiveTabMenu(tab);
          setEnterMode(false);
        }}
      >
        <span className={'menu-item-count'}>{tabIndex}</span>
        <p className={'menu-item-text'}>{title || defaultTitle}</p>
      </Menu.Item>
    </React.Fragment>
  );
};

const View = (props) => {
  const [hashlinkOnMount, setHashlinkOnMount] = React.useState(false);

  const {
    metadata = {},
    data = {},
    tabsList = [],
    tabs = {},
    activeTabIndex = 0,
    hashlink = {},
    setActiveTab = () => {},
  } = props;

  const [menuPosition, setMenuPosition] = React.useState({});
  const [activeTabMenu, setActiveTabMenu] = React.useState(tabsList[0]);
  const [enterMode, setEnterMode] = React.useState(false);
  const handleKeyDownTabs = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setActiveTab(activeTabMenu);
      setEnterMode(true);
    }
    if (!event.shiftKey && event.key === 'Tab') {
      if (tabsList.indexOf(activeTabMenu) === tabsList.length - 1) {
        return;
      } else {
        if (enterMode === false) {
          event.preventDefault();
          setActiveTabMenu(
            tabsList[(tabsList.indexOf(activeTabMenu) + 1) % tabsList.length],
          );
        }
      }
    } else if (event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      if (tabsList.indexOf(activeTabMenu) === 0) {
        return;
      }
      if (enterMode === false) {
        setActiveTabMenu(
          tabsList[(tabsList.indexOf(activeTabMenu) - 1) % tabsList.length],
        );
      }
    }
  };
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

  React.useEffect(() => {
    const urlHash = props.location.hash.substring(1) || '';
    if (
      hashlink.counter > 0 ||
      (hashlink.counter === 0 && urlHash && !hashlinkOnMount)
    ) {
      const id = hashlink.hash || urlHash || '';
      const index = tabsList.indexOf(id);
      const parentId = data.id || props.id;
      const parent = document.getElementById(parentId);
      const headerWrapper = document.querySelector('.header-wrapper');
      const offsetHeight = headerWrapper?.offsetHeight || 0;
      if (id !== parentId && index > -1 && parent) {
        if (activeTabIndex !== index) {
          setActiveTab(id);
        }
        props.scrollToTarget(parent, offsetHeight);
      } else if (id === parentId && parent) {
        props.scrollToTarget(parent, offsetHeight);
      }
    }
    if (!hashlinkOnMount) {
      setHashlinkOnMount(true);
    }
    /* eslint-disable-next-line */
  }, [hashlink.counter]);

  const panes = tabsList.map((tab, index) => {
    return {
      id: tab,
      menuItem: (
        <MenuItem
          {...props}
          key={tab}
          tab={tab}
          index={index}
          activeTabMenu={activeTabMenu}
          setActiveTabMenu={setActiveTabMenu}
          setEnterMode={setEnterMode}
          tabsTitle={tabsTitle}
          tabsDescription={tabsDescription}
        />
      ),
      render: () => {
        return (
          <Tab.Pane as={isContainer ? Container : undefined}>
            <RenderBlocks {...props} metadata={metadata} content={tabs[tab]} />
          </Tab.Pane>
        );
      },
    };
  });

  return (
    <>
      <Tab
        activeIndex={activeTabIndex}
        className="default tabs"
        tabIndex={0}
        onKeyDown={handleKeyDownTabs}
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

export default compose(
  connect((state) => {
    return {
      hashlink: state.hashlink,
    };
  }),
  withScrollToTarget,
)(withRouter(View));
