import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import TabsBlockView from './TabsBlockView';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import schema from './schema';
import { useFormStateContext } from '@plone/volto/components/manage/Form/FormContext';

const EditTabsBlock = (props) => {
  const [activeTab, setActiveTab] = React.useState(0);
  console.log('activeTab', activeTab);
  const { contextData, setContextData } = useFormStateContext();
  const currentContextData = React.useRef(null);

  React.useEffect(() => {
    if (!currentContextData.current) {
      currentContextData.current = contextData;
      console.log('current', currentContextData.current);
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
