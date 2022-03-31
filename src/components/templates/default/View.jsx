import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Menu, Tab, Container } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import {
  SimpleMarkdown,
  getMenuPosition,
} from '@eeacms/volto-tabs-block/utils';

import '@eeacms/volto-tabs-block/less/menu.less';

const MenuItem = (props) => {
  const { activeTab = null, tabs = {}, setActiveTab = () => {} } = props;
  const { tab, index } = props;
  const title = tabs[tab].title;
  const tabIndex = index + 1;

  const defaultTitle = `Tab ${tabIndex}`;

  return (
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
  const menuPosition = getMenuPosition(data);
  const isContainer = data.align === 'full';
  const tabsTitle = data.title;
  const tabsDescription = data.description;

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
      menuItem: () => {
        return (
          <React.Fragment key={`tab-${tab}`}>
            {index === 0 && (tabsTitle || tabsDescription) ? (
              <Menu.Item className="menu-title">
                <SimpleMarkdown
                  md={tabsTitle}
                  defaultTag="##"
                  className="title"
                />
                <SimpleMarkdown md={tabsDescription} className="description" />
              </Menu.Item>
            ) : (
              ''
            )}
            <MenuItem {...props} tab={tab} index={index} />
          </React.Fragment>
        );
      },
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
        menu={{
          attached: menuPosition.attached,
          borderless: data.menuBorderless,
          color: data.menuColor,
          compact: data.menuCompact ?? true,
          fluid: data.menuFluid ?? true,
          inverted: data.menuInverted,
          pointing: data.menuPointing,
          secondary: data.menuSecondary,
          size: data.menuSize,
          stackable: data.menuStackable,
          tabular: data.menuTabular,
          text: data.menuText ?? true,
          vertical: menuPosition.vertical,
          className: cx(data.menuAlign, { container: isContainer }),
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
