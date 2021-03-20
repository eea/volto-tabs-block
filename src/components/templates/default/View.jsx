import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { Menu, Tab } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';

import '@eeacms/volto-tabs-block/less/menu.less';

const View = (props) => {
  const [hashlinkOnMount, setHashlinkOnMount] = React.useState(false);
  const {
    metadata = {},
    data = {},
    tabsList = [],
    tabs = {},
    tabData = {},
    activeTab = null,
    activeTabIndex = 0,
    hashlink = {},
    setActiveTab = () => {},
  } = props;
  const uiContainer = data.align === 'full' ? 'ui container' : '';

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
    const name = tabs[tab].title || `Tab ${index + 1}`;

    return {
      id: tab,
      menuItem: () => {
        return (
          <>
            <Menu.Item
              name={name}
              active={tab === activeTab}
              onClick={() => {
                setActiveTab(tab);
              }}
            >
              {name}
            </Menu.Item>
          </>
        );
      },
      render: () => {
        return (
          <Tab.Pane>
            {' '}
            <RenderBlocks {...props} metadata={metadata} content={tabData} />
          </Tab.Pane>
        );
      },
    };
  });

  return (
    <>
      <Tab
        menu={{}}
        panes={panes}
        activeIndex={activeTabIndex}
        className={uiContainer}
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
