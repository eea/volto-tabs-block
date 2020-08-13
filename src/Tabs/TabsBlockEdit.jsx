import { useSelector } from 'react-redux';
import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { useFormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import { getBlocks } from '@plone/volto/helpers';
import { TABSBLOCK } from 'volto-tabsblock/constants';

import {
  globalDeriveTabsFromState,
  deriveTabsFromState,
  tabsLayoutToBlocksLayout,
} from './utils';
import TabsBlockView from './TabsBlockView';
import schema from './schema';

const s = JSON.stringify;

// there has been changes in the overall layout, we need to sync it to
// the tabs layout

// unfortunately we don't have events or reducers in Volto's Form.jsx
// that would make this easier, so we need a way to understand how to
// divide the tabs. We take advantage that we control where the tabs can
// appear (the activeTab).
//
// A block can only appear or dissapear in the activeTab
// When it appears, we need to see which other block is before it
// The same when it dissapears

const EditTabsBlock = (props) => {
  const { block, data, onChangeBlock } = props;
  const activeTab = useSelector(
    (state) => state.tabs_block[block]?.selection || 0,
  );
  const tabsState = useSelector((state) => state.tabs_block);
  const currentTabsState = React.useRef(tabsState);

  const { contextData, setContextData } = useFormStateContext();
  const currentContextData = React.useRef(null);

  const { tabsLayout = [], tabs = [] } = props.data;

  if (tabs.length !== tabsLayout.length) {
    tabsLayout.fill([], tabsLayout.length, tabs.length);
  }

  React.useEffect(() => {
    if (!currentContextData.current) {
      currentContextData.current = contextData;
    }

    // on anything block change: update the tabsLayout based on blocks_layout.
    // on tabs switch: update blocks_layout based on tabsLayout

    const { formData } = contextData;
    const blocks = getBlocks(formData);

    if (!data.initialized) {
      // if the tab has just been dropped, it hasn't been initialized
      // In this case, we initialize the tabsLayout and update as initialized
      const res = deriveTabsFromState({
        tabsLayout,
        blocks,
        // tabs,
        activeTab,
        currentBlock: block, // temporary
      });
      const blockIndex = blocks
        .filter(([id, value]) => value['@type'] === TABSBLOCK)
        .findIndex(([id]) => id === block);
      onChangeBlock(block, {
        ...data,
        initialized: true,
        tabsLayout: res[blockIndex],
      }).then(() => {});
    }

    const isTabsChanged =
      data.tabsLayout && s(currentTabsState.current) !== s(tabsState);
    const isBlocksChanged =
      data.tabsLayout && s(currentTabsState.current) === s(tabsState);

    currentTabsState.current = tabsState;

    if (isTabsChanged) {
      // calculate layout based on changing tabs
      const new_layout = tabsLayoutToBlocksLayout(
        contextData.formData,
        tabsState,
      );
      const data = {
        ...contextData,
        formData: {
          ...contextData.formData,
          blocks_layout: {
            ...contextData.formData.blocks_layout,
            items: new_layout,
          },
        },
      };
      setContextData(data);
    }

    if (isBlocksChanged) {
      // calculate layout based on mutations in tabs
      const new_layout = tabsLayoutToBlocksLayout(
        contextData.formData,
        tabsState,
      );
      if (
        JSON.stringify(new_layout) !==
        JSON.stringify(contextData.formData.blocks_layout.items)
      ) {
        const newTabsLayout = globalDeriveTabsFromState({ blocks, tabsState });
        console.log('new', newTabsLayout);
        // const data = {
        //   ...contextData,
        //   formData: {
        //     ...contextData.formData,
        //     blocks_layout: {
        //       ...contextData.formData.blocks_layout,
        //       items: new_layout,
        //     },
        //   },
        // };
        // console.log('need to change data', data);
        // setContextData(data);
        // console.log('need to change layout', new_layout);
        // console.log('need to change tabsState', tabsState);
      }
    }
  }); // [activeTab, tabsLayout, block, contextData]

  return (
    <div className="block selected">
      <div className="block-inner-wrapper">
        <TabsBlockView {...props} />
      </div>

      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...data,
              [id]: value,
            });
          }}
          formData={data}
          block={props.block}
        />
      </SidebarPortal>
    </div>
  );
};

export default EditTabsBlock;

// console.log('data', data);

// console.log('blocksLayout', newBlocksLayout);
// console.log('tabsLayout', tabsLayout);

// props.onChangeBlock(props.block, {
//   ...props.data,
//   tabsLayout,
// });
// currentContextData.current = contextData;
// console.log('activeTab', activeTab);
// onTabChange={(index) => {
//   setTimeout(() => {
//     const blocks_layout = tabsLayoutToBlocksLayout(
//       contextData.formData,
//       tabsState,
//     );

//     console.log('new blocks', blocks_layout);
//   }, 0);
// }}
