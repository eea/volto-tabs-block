import React from 'react';
import { isEmpty } from 'lodash';
import { v4 as uuid } from 'uuid';
import { Menu, Tab } from 'semantic-ui-react';
import { BlocksForm } from '@plone/volto/components';
import { emptyBlocksForm } from '@plone/volto/helpers';
import EditBlockWrapper from '@eeacms/volto-tabs-block/components/EditBlockWrapper';

import '@eeacms/volto-tabs-block/less/menu.less';

const Edit = (props) => {
  const {
    selected = false,
    manage = false,
    metadata = null,
    block = null,
    data = {},
    tabsData = {},
    tabsList = [],
    tabs = {},
    tabData = {},
    multiSelected = [],
    activeBlock = null,
    activeTab = null,
    activeTabIndex = 0,
    onChangeBlock = () => {},
    setActiveBlock = () => {},
    setActiveTab = () => {},
    emptyTab = () => {},
    onChangeTabData = () => {},
    onSelectBlock = () => {},
  } = props;
  const uiContainer = data.align === 'full' ? 'ui container' : false;

  const addNewTab = () => {
    const tabId = uuid();

    onChangeBlock(block, {
      ...data,
      data: {
        ...tabsData,
        blocks: {
          ...tabsData.blocks,
          [tabId]: {
            ...emptyTab(),
          },
        },
        blocks_layout: {
          items: [...tabsData.blocks_layout.items, tabId],
        },
      },
    });
  };

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
                if (activeBlock) {
                  setActiveBlock(null);
                }
              }}
            >
              {name}
            </Menu.Item>
            {index === tabsList.length - 1 ? (
              <>
                <Menu.Item name="addition" onClick={addNewTab}>
                  +
                </Menu.Item>
              </>
            ) : (
              ''
            )}
          </>
        );
      },
      render: () => {
        return (
          <Tab.Pane>
            <BlocksForm
              title={data?.placeholder}
              description={data?.instrunctions?.data}
              manage={manage}
              allowedBlocks={data?.allowedBlocks}
              metadata={metadata}
              properties={isEmpty(tabs[tab]) ? emptyBlocksForm() : tabs[tab]}
              selectedBlock={selected && activeBlock ? activeBlock : null}
              selected={activeBlock === tab}
              onSelectBlock={(id, selected, e) => {
                const isMultipleSelection = e
                  ? e.shiftKey || e.ctrlKey || e.metaKey
                  : false;
                onSelectBlock(
                  id,
                  activeBlock === id ? false : isMultipleSelection,
                  e,
                );
              }}
              onChangeFormData={(newFormData) => {
                onChangeBlock(block, {
                  ...data,
                  data: {
                    ...tabsData,
                    blocks: {
                      ...tabsData.blocks,
                      [activeTab]: {
                        ...(newFormData.blocks_layout.items.length > 0
                          ? newFormData
                          : emptyTab()),
                      },
                    },
                  },
                });
              }}
              onChangeField={onChangeTabData}
              pathname={props.pathname}
            >
              {({ draginfo }, editBlock, blockProps) => {
                return (
                  <EditBlockWrapper
                    draginfo={draginfo}
                    blockProps={blockProps}
                    multiSelected={multiSelected.includes(blockProps.block)}
                  >
                    {editBlock}
                  </EditBlockWrapper>
                );
              }}
            </BlocksForm>
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

export default Edit;
