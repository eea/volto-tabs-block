import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import TabsBlockView from './TabsBlockView';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import schema from './schema';
import { useFormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import { getBlocks } from '@plone/volto/helpers';
import { deriveTabsFromState } from './utils';

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
    // console.log('blocks', blocks);
    const res = deriveTabsFromState({
      tabsLayout,
      blocks,
      tabs,
      activeTab,
      currentBlock: props.block, // temporary
    });
    console.log('res', res);

    // console.log('blocksLayout', newBlocksLayout);
    // console.log('tabsLayout', tabsLayout);

    // props.onChangeBlock(props.block, {
    //   ...props.data,
    //   tabsLayout,
    // });
    // currentContextData.current = contextData;
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
