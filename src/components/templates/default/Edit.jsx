import React from 'react';
import { isEmpty } from 'lodash';
import { v4 as uuid } from 'uuid';
import cx from 'classnames';
import { Menu, Tab, Input, Container } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { BlocksForm } from '@plone/volto/components';
import { emptyBlocksForm } from '@plone/volto/helpers';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import EditBlockWrapper from '@eeacms/volto-tabs-block/components/EditBlockWrapper';
import {
  SimpleMarkdown,
  getMenuPosition,
} from '@eeacms/volto-tabs-block/utils';

import '@eeacms/volto-tabs-block/less/menu.less';

import noop from 'lodash/noop';

const MenuItem = (props) => {
  const inputRef = React.useRef(null);
  const {
    activeTab = null,
    activeBlock = null,
    block = null,
    data = {},
    editingTab = null,
    selected = false,
    tabData = {},
    tabs = {},
    tabsData = {},
    tabsDescription,
    tabsList = [],
    tabsTitle,
    emptyTab = noop,
    setActiveBlock = noop,
    setActiveTab = noop,
    setEditingTab = noop,
    onChangeBlock = noop,
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
      {index === 0 && (tabsTitle || tabsDescription) && (
        <Menu.Item className="menu-title">
          <SimpleMarkdown md={tabsTitle} className="title" defaultTag="##" />
          <SimpleMarkdown md={tabsDescription} className="description" />
        </Menu.Item>
      )}
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
    emptyTab = noop,
    onChangeBlock = noop,
    onChangeTabData = noop,
    onSelectBlock = noop,
    setEditingTab = noop,
  } = props;
  const menuPosition = getMenuPosition(data);
  const isContainer = data.align === 'full';
  const tabsTitle = data.title;
  const tabsDescription = data.description;

  const schema = React.useMemo(
    () =>
      config.blocks.blocksConfig[TABS_BLOCK].templates?.['default']?.schema(
        config,
        props,
      ) || {},
    [props],
  );

  const getDataValue = React.useCallback(
    (key) => {
      return (
        (schema.properties[key]?.value || data[key]) ??
        schema.properties[key]?.defaultValue
      );
    },
    [schema, data],
  );

  const panes = tabsList.map((tab, index) => {
    return {
      id: tab,
      menuItem: (
        <MenuItem
          {...props}
          key={tab}
          editingTab={editingTab}
          index={index}
          setEditingTab={setEditingTab}
          tab={tab}
          tabsTitle={tabsTitle}
          tabsDescription={tabsDescription}
        />
      ),
      render: () => {
        return (
          <Tab.Pane as={isContainer ? Container : undefined}>
            <BlocksForm
              allowedBlocks={data?.allowedBlocks}
              description={data?.instrunctions?.data}
              manage={manage}
              metadata={metadata}
              pathname={props.pathname}
              properties={isEmpty(tabs[tab]) ? emptyBlocksForm() : tabs[tab]}
              selected={selected && activeTab === tab && activeBlock}
              selectedBlock={
                selected && activeTab === tab && activeBlock
                  ? activeBlock
                  : null
              }
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
        className="default tabs"
        menu={{
          attached: menuPosition.attached,
          borderless: getDataValue('menuBorderless'),
          color:
            props?.template === 'accordion' && props?.data?.theme
              ? `theme-${props?.data?.theme}`
              : getDataValue('menuColor'),
          compact: getDataValue('menuCompact'),
          fluid: getDataValue('menuFluid'),
          inverted: getDataValue('menuInverted'),
          pointing: getDataValue('menuPointing'),
          secondary: getDataValue('menuSecondary'),
          size: getDataValue('menuSize'),
          stackable: getDataValue('menuStackable'),
          tabular: getDataValue('menuTabular'),
          text: getDataValue('menuText'),
          vertical: menuPosition.vertical,
          className: cx(
            data.menuAlign,
            menuPosition.direction === 'left' ? 'border-right' : '',
            menuPosition.direction === 'right' ? 'border-left' : '',
            menuPosition.direction === 'top' ? 'border-bottom' : '',
            menuPosition.direction === 'bottom' ? 'border-top' : '',
            { container: isContainer },
          ),
        }}
        menuPosition={menuPosition.direction}
        panes={panes}
        grid={{ paneWidth: 9, tabWidth: 3 }}
      />
    </>
  );
};

export default Edit;
