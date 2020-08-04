import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import TabsBlockView from './TabsBlockView';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import schema from './schema';
import { useFormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import { getBlocks } from '@plone/volto/helpers';

const EditTabsBlock = (props) => {
  const [activeTab, setActiveTab] = React.useState(0);
  // console.log('activeTab', activeTab);
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

    const { formData } = contextData;
    const blocks = getBlocks(formData);
    const blockIds = blocks.map(([id]) => id);

    // all available blocks in blocks_layout.items
    const afterBlocksIds = blockIds.slice(blockIds.indexOf(props.block) + 1);

    // blocks as defined in the tabs layout
    const tabsLayoutBlockIds = tabsLayout.flat(1);

    if (tabsLayoutBlockIds !== afterBlocksIds) {
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

      const added = afterBlocksIds
        .map((b) => !tabsLayoutBlockIds.includes(b) && b)
        .filter((b) => b);
      const removed = tabsLayoutBlockIds
        .map((b) => !afterBlocksIds.includes(b) && b)
        .filter((b) => b);
      if (added.length) {
        // We assume continuos range of blocks
        // get the previous block in current tab. If this tab doesn't exist,
        // insert at position 0
        const prevTab = afterBlocksIds.indexOf(added[0][0]);
        const upto = Math.max(afterBlocksIds.indexOf(prevTab), 0);
        const tabs = (tabsLayoutBlockIds[activeTab] || [])
          .slice(0, upto)
          .concat(added);
        tabsLayout[activeTab] = tabs;
        console.log('new tabs', tabs);
        props.onChangeBlock(props.block, {
          ...props.data,
          tabs: tabsLayout,
        });
      }
      if (removed.length) {
        console.log('removed', removed);
      }
    }
  });

  return (
    <div className="block selected">
      <div className="block-inner-wrapper">
        <TabsBlockView
          data={props.data}
          onTabChange={(index) => {
            setActiveTab(index);
          }}
          activeIndex={activeTab}
        />
      </div>

      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={schema}
          title={schema.title}
          onChangeField={(id, value) => {
            props.onChangeBlock(props.block, {
              ...props.data,
              [id]: value,
            });
          }}
          formData={props.data}
          block={props.block}
        />
      </SidebarPortal>
    </div>
  );
};

export default EditTabsBlock;
