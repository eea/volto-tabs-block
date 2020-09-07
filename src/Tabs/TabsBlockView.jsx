import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '@eeacms/volto-tabs-block/actions';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import { isEqual } from './utils';
import withBlockExtension from './withBlockExtension';

import './public.less';

const TabsBlockView = (props) => {
  const { id, data, mode = 'view', properties, extension } = props;

  const dispatch = useDispatch();
  const pathKey = useSelector((state) => state.router.location.key);
  const tabsState = useSelector((state) => state.tabs_block[pathKey] || {});
  const mounted = React.useRef();
  const saved_blocks_layout = React.useRef([]);
  const blocks_layout = properties.blocks_layout?.items;

  const { tabs = [], tabsLayout = [] } = data;
  const globalActiveTab = tabsState[id] || 0;

  // We have the following "racing" condition:
  // The tabsblockview is mounted sometime before the GET_CONTENT_SUCCESS
  // action is triggered, so even if we "fix" the display,
  // the global state.data.blocks_layout will be overwritten with the "wrong"
  // content. So we need to watch if the blocks_layout is rewritten, to trigger
  // the tab change again
  React.useEffect(() => {
    if (!mounted.current && mode === 'view') {
      const newTabsState = {};
      Object.keys(tabsState).forEach((blockid) => {
        newTabsState[blockid] = 0;
      });
      dispatch(setActiveTab(id, 0, mode, newTabsState, pathKey));
      mounted.current = true;
    }
    if (
      mode === 'view' &&
      !isEqual(blocks_layout, saved_blocks_layout.current)
    ) {
      const newTabsState = {};
      saved_blocks_layout.current = blocks_layout;
      Object.keys(tabsState).forEach((blockid) => {
        newTabsState[blockid] = 0;
      });
      dispatch(setActiveTab(id, 0, mode, newTabsState, pathKey));
    }
  }, [dispatch, id, mode, tabsState, blocks_layout, pathKey]);

  const Renderer = extension?.view;

  const onTabChange = React.useCallback(
    (event, { activeIndex }) => {
      dispatch(setActiveTab(id, activeIndex, mode, tabsState, pathKey));
    },
    [dispatch, id, mode, pathKey, tabsState],
  );

  return (
    <div className={cx('tabsblock', data.css_class)}>
      <div className="ui container">
        {Renderer ? (
          <Renderer
            tabs={tabs}
            tabsLayout={tabsLayout}
            globalActiveTab={globalActiveTab}
            properties={properties}
            onTabChange={onTabChange}
            mode={mode}
            {...props}
          />
        ) : (
          <div>View extension not found</div>
        )}
      </div>
    </div>
  );
};

export default injectIntl(withBlockExtension(TabsBlockView));
