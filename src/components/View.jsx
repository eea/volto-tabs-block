import React, { useRef, useEffect } from 'react';
import cx from 'classnames';
import { StyleWrapperView } from '@eeacms/volto-block-style/StyleWrapper';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { DefaultView } from './templates/default';
import config from '@plone/volto/registry';
import '@eeacms/volto-tabs-block/less/edit.less';
import '@eeacms/volto-tabs-block/less/tabs.less';

const View = (props) => {
  const view = React.useRef(null);
  const { data = {}, uiContainer = '', blockProps } = props;
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
  const ref = useRef(null);
  const handleKeyDownTabs = (event) => {
    if (event.key === 'Enter') {
    }
    if (event.key === 'Tab') {
      if (activeTabIndex === tabsList.length - 1) {
        return;
      } else {
        setActiveTab(tabsList[(activeTabIndex + 1) % tabsList.length]);
        event.preventDefault();
      }
    }
  };
  return (
    <StyleWrapperView
      {...props}
      data={data}
      styleData={data.styles || {}}
      styled={true}
    >
      <div
        className={cx('tabs-block', template, theme, verticalAlign)}
        id={props.id}
        tabIndex="0"
        onKeyDown={handleKeyDownTabs}
        role="button"
      >
        <StyleWrapperView
          {...props}
          data={tabData}
          styleData={tabData.styles || {}}
          styled={true}
          tabIndex="0"
          ref={ref}
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
