import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Menu, Tab, Container, Dropdown, Button } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { RenderBlocks } from '@plone/volto/components';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import {
  SimpleMarkdown,
  getMenuPosition,
  positionedOffset,
  toggleItem,
} from '@eeacms/volto-tabs-block/utils';

import '@eeacms/volto-tabs-block/less/menu.less';

const MenuItem = (props) => {
  const { activeTab = null, tabs = {}, setActiveTab = () => {} } = props;
  const { tabsTitle, tabsDescription, tab, index } = props;
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
      <Button
        as="a"
        className={cx('item', { active: tab === activeTab })}
        item-data={tab}
        onClick={() => {
          if (activeTab !== tab) {
            setActiveTab(tab);
          }
        }}
      >
        <span className={'menu-item-count'}>{tabIndex}</span>
        <p className={'menu-item-text'}>{title || defaultTitle}</p>
      </Button>
    </React.Fragment>
  );
};

const MenuWrapper = (props) => {
  const {
    data = {},
    panes = [],
    activeTab = null,
    node = null,
    screen = {},
    tabs = {},
    tabsList = [],
    setActiveTab = () => {},
  } = props;

  React.useEffect(() => {
    if (!true || !node?.current) return;
    const items = node.current.querySelectorAll(
      '.ui.menu > .menu-wrapper > .item:not(.menu-title)',
    );
    const underlineMenu = node.current.querySelector('.ui.dropdown');
    if (!underlineMenu) return;
    const overflowOffset = positionedOffset(underlineMenu, node.current);
    if (!overflowOffset) {
      return;
    }
    let anyHidden = false;
    for (const item of items) {
      const itemOffset = positionedOffset(item, node.current);
      if (itemOffset) {
        const hidden =
          itemOffset.left + item.offsetWidth >= overflowOffset.left;
        toggleItem(node.current, item, hidden);
        anyHidden = anyHidden || hidden;
      }
    }
    underlineMenu.style.visibility = anyHidden ? '' : 'hidden';
  }, [screen, node, data.isResponsive]);

  return (
    <React.Fragment>
      <div className="menu-wrapper">
        {panes.map((pane, index) => (
          <React.Fragment key={`menu-item-${index}-${pane.id}`}>
            {pane.menuItem}
          </React.Fragment>
        ))}
      </div>
      {true && (
        <Dropdown
          icon="ellipsis horizontal"
          className="item"
          pointing="top right"
        >
          <Dropdown.Menu>
            {tabsList.map((underlineTab, underlineIndex) => {
              const title = tabs[underlineTab].title;
              const defaultTitle = `Tab ${underlineIndex + 1}`;

              return (
                <Dropdown.Item
                  hidden
                  key={`underline-tab-${underlineIndex}-${underlineTab}`}
                  underline-item-data={underlineTab}
                  active={underlineTab === activeTab}
                  onClick={() => {
                    if (activeTab !== underlineTab) {
                      setActiveTab(underlineTab);
                    }
                  }}
                >
                  <span className={'menu-item-count'}>
                    {underlineIndex + 1}
                  </span>
                  <p className={'menu-item-text'}>{title || defaultTitle}</p>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )}
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
    screen,
    setActiveTab = () => {},
  } = props;
  const menuPosition = getMenuPosition(data);
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
          tab={tab}
          tabsList={tabsList}
          index={index}
          lastIndex={tabsList.length - 1}
          tabsTitle={tabsTitle}
          tabsDescription={tabsDescription}
        />
      ),
      render: () => {
        return (
          <>
            <Tab.Pane as={isContainer ? Container : undefined}>
              <RenderBlocks
                {...props}
                metadata={metadata}
                content={tabs[tab]}
              />
            </Tab.Pane>
          </>
        );
      },
    };
  });

  return (
    <>
      <Tab
        activeIndex={activeTabIndex}
        className="horizontal-responsive tabs"
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
          className: cx(data.menuAlign, { container: isContainer }),
          items: undefined,
          children: (
            <MenuWrapper
              {...props}
              panes={panes}
              menuPosition={menuPosition}
              screen={screen}
            />
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
      screen: state.screen,
    };
  }),
  withScrollToTarget,
)(withRouter(View));
