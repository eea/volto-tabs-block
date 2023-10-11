import React from 'react';
import { without } from 'lodash';
import cx from 'classnames';
import config from '@plone/volto/registry';
import {
  SidebarPortal,
  BlocksToolbar,
  BlockDataForm,
} from '@plone/volto/components';
import { getBlocksLayoutFieldname } from '@plone/volto/helpers';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { empty, emptyTab } from '@eeacms/volto-tabs-block/helpers';
import { StyleWrapperView } from '@eeacms/volto-block-style/StyleWrapper';
import { BlockStyleWrapperEdit } from '@eeacms/volto-block-style/BlockStyleWrapper';
import { DefaultEdit } from './templates/default';
import { useIntl } from 'react-intl';

import '@eeacms/volto-tabs-block/less/edit.less';
import '@eeacms/volto-tabs-block/less/tabs.less';

const Edit = (props) => {
  const view = React.useRef(null);
  const intl = useIntl();
  const { onChangeBlock, onChangeField } = props;
  const { data = {}, block = null } = props;
  const template = data.variation || 'default';
  const tabsData = data.data || {};
  const tabsList = tabsData.blocks_layout?.items || [];
  const tabs = tabsData.blocks || {};
  const [activeTab, setActiveTab] = React.useState(tabsList?.[0]);
  const [activeBlock, setActiveBlock] = React.useState(null);
  const [editingTab, setEditingTab] = React.useState(null);
  const [multiSelected, setMultiSelected] = React.useState([]);
  const blocksState = React.useRef({});
  const activeTabIndex = tabsList.indexOf(activeTab);
  const tabData = tabs[activeTab] || {};
  const theme = data.theme || 'light';
  const verticalAlign = data.verticalAlign || 'flex-start';
  const tabsBlockConfig = config.blocks.blocksConfig[TABS_BLOCK];

  const activeTemplate = config.blocks.blocksConfig[
    TABS_BLOCK
  ].variations.filter((v, i) => v.id === template);

  const TabsEdit = activeTemplate?.[0]?.edit || DefaultEdit;

  const schemaObject = tabsBlockConfig.blockSchema(props);

  React.useEffect(() => {
    if (!Object.keys(data.data || {}).length) {
      // Initialize TABS_BLOCK
      const tabsData = empty({
        schema: schemaObject.properties.data.schema,
        intl,
      });
      onChangeBlock(block, {
        ...data,
        data: {
          ...tabsData,
        },
      });
      setActiveTab(tabsData.blocks_layout?.items?.[0]);
    }
    /* eslint-disable-next-line */
  }, []);

  const handleKeyDown = (
    e,
    index,
    block,
    node,
    {
      disableEnter = false,
      disableArrowUp = false,
      disableArrowDown = false,
    } = {},
  ) => {
    if (e.key === 'ArrowUp' && !disableArrowUp && !activeBlock) {
      props.onFocusPreviousBlock(block, node);
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' && !disableArrowDown && !activeBlock) {
      props.onFocusNextBlock(block, node);
      e.preventDefault();
    }
    if (e.key === 'Enter' && !disableEnter && !activeBlock && !editingTab) {
      props.onAddBlock(config.settings.defaultBlockType, index + 1);
      e.preventDefault();
    }
    if (e.key === 'Enter' && editingTab) {
      setEditingTab(null);
      e.preventDefault();
    }
  };

  const onChangeTabData = (id, value) => {
    // special handling of blocks and blocks_layout
    if (['blocks', 'blocks_layout'].indexOf(id) > -1) {
      blocksState.current[id] = value;
      onChangeBlock(block, {
        ...data,
        data: {
          ...tabsData,
          blocks: {
            ...tabsData.blocks,
            [activeTab]: {
              ...tabData,
              ...blocksState.current,
            },
          },
        },
      });
    } else {
      onChangeField(id, value);
    }
  };

  const onSelectBlock = (id, isMultipleSelection, event) => {
    let newMultiSelected = [];
    let selected = id;

    if (isMultipleSelection) {
      selected = null;
      const blocksLayoutFieldname = getBlocksLayoutFieldname(tabData);

      const blocks_layout = tabData[blocksLayoutFieldname].items;

      if (event.shiftKey) {
        const anchor =
          multiSelected.length > 0
            ? blocks_layout.indexOf(multiSelected[0])
            : blocks_layout.indexOf(activeBlock);
        const focus = blocks_layout.indexOf(id);

        if (anchor === focus) {
          newMultiSelected = [id];
        } else if (focus > anchor) {
          newMultiSelected = [...blocks_layout.slice(anchor, focus + 1)];
        } else {
          newMultiSelected = [...blocks_layout.slice(focus, anchor + 1)];
        }
      }

      if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        if (multiSelected.includes(id)) {
          selected = null;
          newMultiSelected = without(multiSelected, id);
        } else {
          newMultiSelected = [...(multiSelected || []), id];
        }
      }
    }

    setActiveBlock(selected);
    setMultiSelected(newMultiSelected);
  };

  return (
    <fieldset>
      <BlockStyleWrapperEdit {...props}>
        <legend
          onClick={() => {
            setActiveBlock(null);
            props.setSidebarTab(1);
          }}
          aria-hidden="true"
        >
          Tabs
        </legend>
        <div
          className={cx('tabs-block edit', theme, verticalAlign, template)}
          ref={view}
          role="presentation"
          onKeyDown={(e) => {
            handleKeyDown(e, props.index, props.block, props.blockNode.current);
          }}
          // The tabIndex is required for the keyboard navigation
          /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
          tabIndex={-1}
        >
          <StyleWrapperView
            {...props}
            data={tabData}
            styleData={tabData.styles || {}}
            styled={true}
          >
            <TabsEdit
              {...props}
              schema={schemaObject}
              activeBlock={activeBlock}
              activeTab={activeTab}
              activeTabIndex={activeTabIndex}
              editingTab={editingTab}
              empty={empty}
              emptyTab={emptyTab}
              metadata={props.metadata || props.properties}
              multiSelected={multiSelected}
              tabs={tabs}
              tabData={tabData}
              tabsData={tabsData}
              tabsList={tabsList}
              node={view}
              template={template}
              onChangeTabData={onChangeTabData}
              onSelectBlock={onSelectBlock}
              setActiveBlock={setActiveBlock}
              setActiveTab={setActiveTab}
              setEditingTab={setEditingTab}
            />
          </StyleWrapperView>

          {props.selected ? (
            <BlocksToolbar
              formData={tabData}
              selectedBlock={activeTab}
              selectedBlocks={multiSelected}
              onChangeBlocks={(newBlockData) => {
                onChangeBlock(block, {
                  ...data,
                  data: {
                    ...tabsData,
                    blocks: {
                      ...tabsData.blocks,
                      [activeTab]: {
                        ...tabData,
                        ...newBlockData,
                      },
                    },
                  },
                });
              }}
              onSetSelectedBlocks={(blockIds) => {
                setMultiSelected(blockIds);
              }}
              onSelectBlock={onSelectBlock}
            />
          ) : (
            ''
          )}
          {!data?.readOnlySettings && !activeBlock ? (
            <SidebarPortal selected={props.selected}>
              <BlockDataForm
                block={block}
                schema={schemaObject}
                title={schemaObject.title}
                onChangeBlock={onChangeBlock}
                onChangeField={(id, value) => {
                  onChangeBlock(block, {
                    ...data,
                    [id]: value,
                  });
                }}
                formData={data}
              />
            </SidebarPortal>
          ) : (
            ''
          )}
        </div>
      </BlockStyleWrapperEdit>
    </fieldset>
  );
};

export default Edit;
