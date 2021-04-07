import React from 'react';
import { isEmpty } from 'lodash';
import { v4 as uuid } from 'uuid';
import { Menu, Tab, Input } from 'semantic-ui-react';
import { BlocksForm } from '@plone/volto/components';
import { emptyBlocksForm } from '@plone/volto/helpers';
import EditBlockWrapper from '@eeacms/volto-tabs-block/components/EditBlockWrapper';
import { SimpleMarkdown } from '@eeacms/volto-tabs-block/utils';
import cx from 'classnames';

import '@eeacms/volto-tabs-block/less/menu.less';

const MenuItem = (props) => {
  const inputRef = React.useRef(null);
  const {
    activeTab = null,
    activeBlock = null,
    block = null,
    data = {},
    editingTab = null,
    selected = false,
    tabs = {},
    tabData = {},
    tabsData = {},
    tabsList = [],
    emptyTab = () => {},
    setActiveBlock = () => {},
    setActiveTab = () => {},
    setEditingTab = () => {},
    onChangeBlock = () => {},
  } = props;
  const { tab, index } = props;
  const title = tabs[tab].title;
  const tabIndex = index + 1;
  const defaultTitle = `Tab ${tabIndex}`;

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

  React.useEffect(() => {
    if (editingTab === tab && inputRef.current) {
      inputRef.current.focus();
    }
    /* eslint-disable-next-line */
  }, [editingTab]);

  return (
    <>
      <Menu.Item
        name={defaultTitle}
        active={tab === activeTab}
        onClick={() => {
          if (activeTab !== tab) {
            setActiveTab(tab);
          }
          if (activeBlock) {
            setActiveBlock(null);
          }
          if (editingTab !== tab) {
            setEditingTab(null);
          }
        }}
        onDoubleClick={() => {
          setEditingTab(tab);
        }}
      >
        {editingTab === tab && selected ? (
          <Input
            fluid
            placeholder={defaultTitle}
            ref={inputRef}
            transparent
            value={title}
            onChange={(e) => {
              onChangeBlock(block, {
                ...data,
                data: {
                  ...tabsData,
                  blocks: {
                    ...tabsData.blocks,
                    [tab]: {
                      ...(tabData || {}),
                      title: e.target.value,
                    },
                  },
                },
              });
            }}
          />
        ) : (
          <>
            <span className={'menu-item-count'}>{tabIndex}</span>
            <p className={'menu-item-text'}>{title || defaultTitle}</p>
          </>
        )}
      </Menu.Item>
      {index === tabsList.length - 1 ? (
        <>
          <Menu.Item
            name="addition"
            onClick={() => {
              addNewTab();
              setEditingTab(null);
            }}
          >
            +
          </Menu.Item>
        </>
      ) : (
        ''
      )}
    </>
  );
};

const Edit = (props) => {
  const {
    activeBlock = null,
    activeTab = null,
    activeTabIndex = 0,
    block = null,
    data = {},
    selected = false,
    editingTab = null,
    manage = false,
    metadata = null,
    multiSelected = [],
    tabs = {},
    tabsData = {},
    tabsList = [],
    emptyTab = () => {},
    onChangeBlock = () => {},
    onChangeTabData = () => {},
    onSelectBlock = () => {},
    setEditingTab = () => {},
  } = props;
  const uiContainer = data.align === 'full' ? 'ui container' : false;
  const menuAlign = data.menuAlign || 'left';
  const menuPosition = data.menuPosition || 'inline';
  const tabsTitle = data.title;
  const tabsDescription = data.description;

  const panes = tabsList.map((tab, index) => {
    return {
      id: tab,
      menuItem: () => {
        return (
          <React.Fragment key={`tab-${tab}`}>
            {index === 0 && (tabsTitle || tabsDescription) ? (
              <Menu.Item className="menu-title">
                <SimpleMarkdown md={tabsTitle} defaultTag="##" />
                <SimpleMarkdown md={tabsDescription} />
              </Menu.Item>
            ) : (
              ''
            )}
            <MenuItem
              {...props}
              editingTab={editingTab}
              index={index}
              setEditingTab={setEditingTab}
              tab={tab}
            />
          </React.Fragment>
        );
      },
      render: () => {
        return (
          <Tab.Pane>
            <BlocksForm
              allowedBlocks={data?.allowedBlocks}
              description={data?.instrunctions?.data}
              manage={manage}
              metadata={metadata}
              pathname={props.pathname}
              properties={isEmpty(tabs[tab]) ? emptyBlocksForm() : tabs[tab]}
              selected={activeBlock === tab}
              selectedBlock={selected && activeBlock ? activeBlock : null}
              title={data?.placeholder}
              onChangeField={onChangeTabData}
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
              onSelectBlock={(id, selected, e) => {
                const isMultipleSelection = e
                  ? e.shiftKey || e.ctrlKey || e.metaKey
                  : false;
                onSelectBlock(
                  id,
                  activeBlock === id ? false : isMultipleSelection,
                  e,
                );
                setEditingTab(null);
              }}
            >
              {({ draginfo }, editBlock, blockProps) => {
                return (
                  <EditBlockWrapper
                    blockProps={blockProps}
                    draginfo={draginfo}
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
        activeIndex={activeTabIndex}
        className={cx(`default ${menuPosition} tabs`, uiContainer)}
        menu={{
          className: cx(menuAlign),
        }}
        panes={panes}
      />
    </>
  );
};

export default Edit;
