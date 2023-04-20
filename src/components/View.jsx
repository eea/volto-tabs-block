import React from 'react';
import cx from 'classnames';
import { StyleWrapperView } from '@eeacms/volto-block-style/StyleWrapper';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { DefaultView } from './templates/default';

import config from '@plone/volto/registry';

import '@eeacms/volto-tabs-block/less/edit.less';
import '@eeacms/volto-tabs-block/less/tabs.less';

const View = (props) => {
  const view = React.useRef(null);
  const { data = {}, uiContainer = '' } = props;
  const metadata = props.metadata || props.properties;

  const tabsData = data.data || {};
  const tabsList = tabsData.blocks_layout?.items || [];
  const tabs = tabsData.blocks || {};
  const [activeTab, setActiveTab] = React.useState(tabsList?.[0]);
  const activeTabIndex = tabsList.indexOf(activeTab);
  const tabData = tabs[activeTab] || {};
  const theme = data.theme || 'light';
  const verticalAlign = data.verticalAlign || 'flex-start';
  const [breakPoint, setBreakPoint] = React.useState(undefined);
  const [template, setTemplate] = React.useState(data.template || 'default');
  const TabsView =
    config.blocks.blocksConfig[TABS_BLOCK].templates?.[template]?.view ||
    DefaultView;
  const onBeforePrint = () => {
    setBreakPoint(10000); //big breakpoint to make the tabs into accordion
    setTemplate('accordion');
    let panels = document.getElementsByClassName(
      'RRT__panel ui bottom attached segment tab',
    );
    for (let panel of panels) {
      panel.className += ' active';
    }
    let tabs = document.getElementsByClassName(
      'RRT__tab ui button item title RRT__tab--collapsed',
    );
    for (let tab of tabs) {
      tab.ariaSelected = true;
      tab.className += ' RRT__tab--selected active';
    }
  };
  const onAfterPrint = () => {
    setBreakPoint(undefined); //big breakpoint to make the tabs into accordion
    setTemplate(data.template || 'default');
  };

  React.useEffect(() => {
    window.onbeforeprint = onBeforePrint;
    window.onafterprint = onAfterPrint;
  }, []);
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
            tabIndex={0}
            activeTab={activeTab}
            breakPoint={breakPoint}
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
