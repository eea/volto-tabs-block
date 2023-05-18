import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { v4 as uuid } from 'uuid';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { Menu, Tab, Container, Dropdown, Input } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { emptyBlocksForm } from '@plone/volto/helpers';
import { BlocksForm } from '@plone/volto/components';
import EditBlockWrapper from '@eeacms/volto-tabs-block/components/EditBlockWrapper';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import {
  SimpleMarkdown,
  getMenuPosition,
  positionedOffset,
  toggleItem,
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
        item-data={tab}
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
            item-data={tab}
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
            <span className={'menu-item-count'} item-data={tab}>
              {tabIndex}
            </span>
            <p className={'menu-item-text'} item-data={tab}>
              {title || defaultTitle}
            </p>
          </>
        )}
      </Menu.Item>
      {index === tabsList.length - 1 ? (
        <>
          <Menu.Item
            name="addition"
            onClick={(e) => {
              addNewTab();
              setEditingTab(null);
              e.preventDefault();
            }}
            item-data={'addition'}
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

const MenuWrapper = (props) => {
  const {
    data = {},
    panes = [],
    activeTab = null,
    node = null,
    screen = {},
    tabs = {},
    tabsList = [],
    block = null,
    emptyTab = noop,
    setEditingTab = noop,
    tabsData = {},
    onChangeBlock = noop,
    setActiveTab = noop,
  } = props;
  const [open, setOpen] = React.useState(false);
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
    if (false || !node?.current) return;
    const items = node.current.querySelectorAll(
      '.ui.menu > .menu-wrapper > .item:not(.menu-title)',
    );
    const underlineDropdown = node.current.querySelector('.ui.dropdown');
    if (!underlineDropdown) return;
    const overflowOffset = positionedOffset(underlineDropdown, node.current);
    if (!overflowOffset) {
      return;
    }
    let anyHidden = false;
    for (const item of items) {
      const itemOffset = positionedOffset(item, node.current);
      if (itemOffset) {
        const hidden =
          itemOffset.left + item.offsetWidth >= overflowOffset.left;
        toggleItem(node.current, item, hidden);
        anyHidden = anyHidden || hidden;
      }
    }
    underlineDropdown.style.visibility = anyHidden ? '' : 'hidden';
    if (!anyHidden && open) {
      setOpen(false);
    }
  }, [screen, node, open, data.isResponsive]);

  return (
    <React.Fragment>
      <div className="menu-wrapper tabs-accessibility">
        {panes.map((pane, index) => (
          <React.Fragment key={`menu-item-${index}-${pane.id}`}>
            {pane.menuItem}
          </React.Fragment>
        ))}
      </div>
      <Dropdown
        icon="ellipsis horizontal"
        className="item"
        pointing="top right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <Dropdown.Menu>
          {[...tabsList, 'addition'].map((underlineTab, underlineIndex) => {
            const title =
              underlineTab === 'addition' ? '+' : tabs[underlineTab]?.title;
            const defaultTitle = `Tab ${underlineIndex + 1}`;

            return (
              <Dropdown.Item
                hidden
                key={`underline-tab-${underlineIndex}-${underlineTab}`}
                underline-item-data={underlineTab}
                active={underlineTab === activeTab}
                onClick={(e) => {
                  if (underlineTab === 'addition') {
                    addNewTab();
                    setEditingTab(null);
                    e.preventDefault();
                  } else if (activeTab !== underlineTab) {
                    setActiveTab(underlineTab);
                  }
                  e.preventDefault();
                }}
              >
                <span className={'menu-item-count'}>{underlineIndex + 1}</span>
                <p className={'menu-item-text'}>{title || defaultTitle}</p>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

const Edit = (props) => {
  const {
    metadata = {},
    data = {},
    tabsList = [],
    tabs = {},
    activeTab = null,
    selected = false,
    manage = false,
    activeTabIndex = 0,
    block = null,
    activeBlock = null,
    multiSelected = [],
    screen,
    tabsData = {},
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
          tab={tab}
          tabsList={tabsList}
          blockId={props.id}
          index={index}
          lastIndex={tabsList.length - 1}
          tabsTitle={tabsTitle}
          tabsDescription={tabsDescription}
        />
      ),
      pane: (
        <Tab.Pane as={isContainer ? Container : undefined}>
          <div tabIndex={0} role="tabpanel" id={'tab-pane-' + tab}>
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
          </div>
        </Tab.Pane>
      ),
    };
  });

  return (
    <>
      <Tab
        activeIndex={activeTabIndex}
        className="horizontal-responsive tabs"
        renderActiveOnly={false}
        menu={{
          attached: menuPosition.attached,
          borderless: getDataValue('menuBorderless'),
          color: getDataValue('menuColor'),
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
          className: cx(data.menuAlign, { container: isContainer }),
          children: (
            <MenuWrapper
              {...props}
              panes={panes}
              menuPosition={menuPosition}
              screen={screen}
              tabsList={tabsList}
              blockId={props.id}
              lastIndex={tabsList.length - 1}
              tabsTitle={tabsTitle}
              tabsDescription={tabsDescription}
            />
          ),
        }}
        menuPosition={menuPosition.direction}
        panes={panes}
        grid={{ paneWidth: 9, tabWidth: 3 }}
      />
    </>
  );
};

export default compose(
  connect((state) => {
    return {
      screen: state.screen,
    };
  }),
)(withRouter(Edit));
