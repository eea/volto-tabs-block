import React from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import Tabs from 'react-responsive-tabs';
import { Icon } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { RenderBlocks } from '@plone/volto/components';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';

import 'react-responsive-tabs/styles.css';
import '@eeacms/volto-tabs-block/less/menu.less';

const View = (props) => {
  const {
    metadata = {},
    data = {},
    tabsList = [],
    tabs = {},
    activeTabIndex = 0,
    setActiveTab = () => {},
  } = props;

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

  const items = tabsList.map((tab, index) => {
    const title = tabs[tab].title;
    const defaultTitle = `Tab ${index + 1}`;
    const active = activeTabIndex === index;
    return {
      title: (
        <>
          {title || defaultTitle}{' '}
          <Icon
            size="large"
            name={active ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}
          />
        </>
      ),
      getContent: () => (
        <RenderBlocks {...props} metadata={metadata} content={tabs[tab]} />
      ),
      key: tab,
      tabClassName: cx('ui button item', { active }),
      panelClassName: cx('ui bottom attached segment tab', {
        active,
      }),
    };
  });

  return (
    <>
      <Tabs
        className="tabs aa"
        selectedTabKey={tabsList[activeTabIndex]}
        items={items}
        onChange={(tab) => {
          setActiveTab(tab);
        }}
        tabsWrapperClass={cx(
          'ui pointing secondary menu',
          getDataValue('menuColor'),
          {
            inverted: getDataValue('menuInverted'),
          },
        )}
        showMore={false}
      />
    </>
  );
};

export default compose(withScrollToTarget, withRouter)(View);
