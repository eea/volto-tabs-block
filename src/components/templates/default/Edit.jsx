import React from 'react';
import { isEmpty } from 'lodash';
import { v4 as uuid } from 'uuid';
import { Menu, Tab } from 'semantic-ui-react';
import { BlocksForm } from '@plone/volto/components';
import { emptyBlocksForm } from '@plone/volto/helpers';
import EditBlockWrapper from '@eeacms/volto-tabs-block/components/EditBlockWrapper';
import SlateEditor from 'volto-slate/editor/SlateEditor';
import { serializeNodes } from 'volto-slate/editor/render';
import { Editor } from 'volto-slate/utils';
import cx from 'classnames';

import '@eeacms/volto-tabs-block/less/menu.less';

const createParagraph = (text) => {
  return {
    children: [{ text }],
  };
};

const MenuItem = (props) => {
  const {
    editingTab = null,
    block = null,
    selected = false,
    data = {},
    tabs = {},
    tabsData = {},
    tabsList = [],
    tabData = {},
    activeTab = null,
    activeBlock = null,
    onChangeBlock = () => {},
    setActiveBlock = () => {},
    setActiveTab = () => {},
    setEditingTab = () => {},
    emptyTab = () => {},
  } = props;
  const { tab, index } = props;
  const title = { children: tabs[tab].title || [], isVoid: Editor.isVoid };
  const titleUndefined =
    !title.children.length || Editor.string(title, []) === '';
  const defaultTitle = `Tab ${index + 1}`;

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

  return (
    <>
      <Menu.Item
        name={defaultTitle}
        active={tab === activeTab}
        onClick={() => {
          setActiveTab(tab);
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
          <SlateEditor
            className="tab-title"
            id={tab}
            name={tab}
            value={
              titleUndefined ? [createParagraph(defaultTitle)] : title.children
            }
            onChange={(newTitle) => {
              onChangeBlock(block, {
                ...data,
                data: {
                  ...tabsData,
                  blocks: {
                    ...tabsData.blocks,
                    [tab]: {
                      ...(tabData || {}),
                      title: newTitle,
                    },
                  },
                },
              });
            }}
            block={block}
            renderExtensions={[]}
            selected={editingTab === tab && selected}
            properties={props.metadata}
            placeholder={defaultTitle}
          />
        ) : titleUndefined ? (
          <p>{defaultTitle}</p>
        ) : (
          serializeNodes(title)
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
  const [editingTab, setEditingTab] = React.useState(null);
  const {
    selected = false,
    manage = false,
    metadata = null,
    block = null,
    data = {},
    tabsData = {},
    tabsList = [],
    tabs = {},
    multiSelected = [],
    activeBlock = null,
    activeTab = null,
    activeTabIndex = 0,
    onChangeBlock = () => {},
    emptyTab = () => {},
    onChangeTabData = () => {},
    onSelectBlock = () => {},
  } = props;
  const uiContainer = data.align === 'full' ? 'ui container' : false;
  const tabsTitle = { children: data.title || [], isVoid: Editor.isVoid };
  const tabsTitleUndefined =
    !tabsTitle.children.length || Editor.string(tabsTitle, []) === '';

  const panes = tabsList.map((tab, index) => {
    return {
      id: tab,
      menuItem: () => {
        return (
          <>
            {index === 0 && !tabsTitleUndefined ? (
              <Menu.Item className="menu-title">
                {serializeNodes(tabsTitle.children)}
              </Menu.Item>
            ) : (
              ''
            )}
            <MenuItem
              {...props}
              tab={tab}
              index={index}
              editingTab={editingTab}
              setEditingTab={setEditingTab}
            />
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
                setEditingTab(null);
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
        menu={{
          className: cx(data.align || 'left'),
        }}
        panes={panes}
        activeIndex={activeTabIndex}
        className={cx(uiContainer, data.align || 'left')}
      />
    </>
  );
};

export default Edit;
