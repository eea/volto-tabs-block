import React from 'react';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { DefaultView } from './templates/default';
import { StyleWrapperView } from '@eeacms/volto-block-style/StyleWrapper';
import cx from 'classnames';

import config from '@plone/volto/registry';

const View = (props) => {
  const view = React.useRef(null);
  const { data = {}, uiContainer = '' } = props;
  const metadata = props.metadata || props.properties;
  const template = data.template || 'default';
  const tabsData = data.data || {};
  const tabsList = tabsData.blocks_layout?.items || [];
  const tabs = tabsData.blocks || {};
  const [activeTab, setActiveTab] = React.useState(tabsList?.[0]);
  const activeTabIndex = tabsList.indexOf(activeTab);
  const tabData = tabs[activeTab] || {};
  const theme = data.theme || 'light';
  const verticalAlign = data.verticalAlign || 'flex-start';

  const TabsView =
    config.blocks.blocksConfig[TABS_BLOCK].templates?.[template]?.view ||
    DefaultView;

  return (
    <StyleWrapperView
      {...props}
      data={data}
      styleData={data.styles || {}}
      styled={true}
    >
      <div
        className={cx('tabs-block', template, theme, verticalAlign)}
        ref={view}
      >
        <StyleWrapperView
          {...props}
          data={tabData}
          styleData={tabData.styles || {}}
          styled={true}
        >
          <TabsView
            {...props}
            activeTab={activeTab}
            activeTabIndex={activeTabIndex}
            node={view}
            metadata={metadata}
            parentRef={view}
            tabs={tabs}
            tabData={tabData}
            tabsData={tabsData}
            tabsList={tabsList}
            template={template}
            uiContainer={uiContainer}
            setActiveTab={setActiveTab}
          />
        </StyleWrapperView>
      </div>
    </StyleWrapperView>
  );
};

export default View;
