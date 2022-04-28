import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Ref, Menu, Tab, Container, Dropdown } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { RenderBlocks, Popup } from '@plone/volto/components';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import {
  SimpleMarkdown,
  getMenuPosition,
} from '@eeacms/volto-tabs-block/utils';

import useResponsiveTabs from './useResponsiveTabs';

import '@eeacms/volto-tabs-block/less/menu.less';

const MenuItem = (props) => {
  const {
    activeTab = null,
    tabs = {},
    setActiveTab = () => {},
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
        active={tab === activeTab}
        onClick={() => {
          if (activeTab !== tab) {
            setActiveTab(tab);
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
  const [hashlinkOnMount, setHashlinkOnMount] = React.useState(false);
  const {
    metadata = {},
    data = {},
    tabsList,
    tabs = {},
    activeTabIndex = 0,
    hashlink = {},
    activeTab,
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

  const responsive = getDataValue('responsive');

  const urlHash = props.location.hash.substring(1) || '';
  const { scrollToTarget } = props;

  React.useEffect(() => {
    if (
      hashlink.counter > 0 ||
      (hashlink.counter === 0 && urlHash && !hashlinkOnMount)
    ) {
      const id = hashlink.hash || urlHash || '';
      const index = (tabsList || []).indexOf(id);
      const parentId = data.id || props.id;
      const parent = document.getElementById(parentId);
      const headerWrapper = document.querySelector('.header-wrapper');
      const offsetHeight = headerWrapper?.offsetHeight || 0;

      if (id !== parentId && index > -1 && parent) {
        if (activeTabIndex !== index) {
          setActiveTab(id);
        }
        scrollToTarget(parent, offsetHeight);
      } else if (id === parentId && parent) {
        scrollToTarget(parent, offsetHeight);
      }
    }
    if (!hashlinkOnMount) {
      setHashlinkOnMount(true);
    }
  }, [
    urlHash,
    tabsList,
    setActiveTab,
    props.id,
    scrollToTarget,
    hashlink.counter,
    activeTabIndex,
    data.id,
    hashlink.hash,
    hashlinkOnMount,
  ]);

  const tabsRef = React.useRef();
  const visibleCount = useResponsiveTabs({ responsive, tabsRef, tabsList });

  const maxCount = tabsList.length;

  const hiddenSections = tabsList.slice(visibleCount, tabsList.length);
  const activeTabIds = tabsList.slice(0, visibleCount);

  const panes = [
    ...tabsList.map((tab, index) => {
      return {
        id: tab,
        menuItem:
          hiddenSections.indexOf(tab) === -1 ? (
            <MenuItem
              {...props}
              tab={tab}
              index={index}
              tabsTitle={tabsTitle}
              tabsDescription={tabsDescription}
            />
          ) : (
            () => {}
          ),
        render: () => (
          <Tab.Pane as={isContainer ? Container : undefined}>
            <RenderBlocks {...props} metadata={metadata} content={tabs[tab]} />
          </Tab.Pane>
        ),
      };
    }),

    ...(visibleCount < maxCount
      ? [
          {
            id: 'moreDropdown',

            menuItem: (
              <Menu.Item active={activeTabIds.indexOf(activeTab) === -1}>
                <Popup
                  menu={true}
                  position="bottom left"
                  flowing={true}
                  basic={true}
                  popper={{ className: 'dropdown-popup' }}
                  on="click"
                  trigger={
                    <p className="menu-item-text dropdown-popup-trigger">
                      {`${hiddenSections.length} more`}&hellip;
                    </p>
                  }
                >
                  <Dropdown.Menu>
                    {hiddenSections.map((tab, i) => (
                      <Dropdown.Item
                        key={tab}
                        active={tab === activeTab}
                        onClick={() => {
                          setActiveTab(tab);
                        }}
                      >
                        {tabs[tab].title}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Popup>
              </Menu.Item>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <Ref innerRef={tabsRef}>
        <Tab
          activeIndex={activeTabIndex}
          className="default tabs"
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
          }}
          menuPosition={menuPosition.direction}
          panes={panes}
          grid={{ paneWidth: 9, tabWidth: 3 }}
        />
      </Ref>
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
