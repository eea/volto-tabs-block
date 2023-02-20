import React from 'react';
import { v4 as uuid } from 'uuid';
import { omit, without } from 'lodash';
import move from 'lodash-move';
import { Icon, FormFieldWrapper } from '@plone/volto/components';
import { DragDropList } from '@plone/volto/components';
import { emptyTab } from '@eeacms/volto-tabs-block/helpers';
import { StyleWrapperEdit } from '@eeacms/volto-block-style/StyleWrapper';

import dragSVG from '@plone/volto/icons/drag.svg';
import themeSVG from '@plone/volto/icons/theme.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import plusSVG from '@plone/volto/icons/circle-plus.svg';

export function moveColumn(formData, source, destination) {
  return {
    ...formData,
    blocks_layout: {
      items: move(formData.blocks_layout?.items, source, destination),
    },
  };
}

const empty = () => {
  return [uuid(), emptyTab()];
};

const TabsWidget = (props) => {
  const [blockStyleVisible, setBlockStyleVisible] = React.useState(false);
  const [activeTabId, setActiveTabId] = React.useState(0);
  const { value = {}, id, onChange } = props;
  const { blocks = {} } = value;
  const tabsList = (value.blocks_layout?.items || []).map((id) => [
    id,
    blocks[id],
  ]);
  const activeTabData = blocks[activeTabId] || {};

  return (
    <FormFieldWrapper
      {...props}
      draggable={false}
      className="drag-drop-list-widget"
    >
      <div className="tabs-area">
        <DragDropList
          childList={tabsList}
          onMoveItem={(result) => {
            const { source, destination } = result;
            if (!destination) {
              return;
            }
            const newFormData = moveColumn(
              value,
              source.index,
              destination.index,
            );
            onChange(id, newFormData);
            return true;
          }}
        >
          {(dragProps) => {
            const { childId, child, index, draginfo } = dragProps;
            return (
              <div ref={draginfo.innerRef} {...draginfo.draggableProps}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      visibility: 'visible',
                      display: 'inline-block',
                    }}
                    {...draginfo.dragHandleProps}
                    className="drag handle wrapper"
                  >
                    <Icon name={dragSVG} size="18px" />
                  </div>
                  <div className="tab-area">
                    <div className="label">
                      {child.title || `Tab ${index + 1}`}
                    </div>
                    <button
                      onClick={() => {
                        setActiveTabId(childId);
                        setBlockStyleVisible(true);
                      }}
                      title="Apply style"
                    >
                      <Icon name={themeSVG} size="18px" />
                    </button>
                    {value.blocks_layout?.items?.length > 1 ? (
                      <button
                        onClick={() => {
                          const newFormData = {
                            ...value,
                            blocks: omit({ ...value.blocks }, [childId]),
                            blocks_layout: {
                              ...value.blocks_layout,
                              items: without(
                                [...value.blocks_layout?.items],
                                childId,
                              ),
                            },
                          };
                          onChange(id, newFormData);
                        }}
                        title="Delete tab"
                      >
                        <Icon name={trashSVG} size="18px" />
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        </DragDropList>
        <button
          onClick={() => {
            const [newId, newData] = empty();
            onChange(id, {
              ...value,
              blocks: {
                ...value.blocks,
                [newId]: newData,
              },
              blocks_layout: {
                ...value.blocks_layout,
                items: [...value.blocks_layout?.items, newId],
              },
            });
          }}
          title="Add new tab"
        >
          <Icon name={plusSVG} size="18px" />
        </button>
      </div>
      <StyleWrapperEdit
        {...props}
        selected={activeTabId}
        isVisible={blockStyleVisible}
        setIsVisible={(value) => {
          setActiveTabId(null);
          setBlockStyleVisible(value);
        }}
        data={{
          ...activeTabData?.styles,
          ...(activeTabData.align ? { align: activeTabData.align } : {}),
          ...(activeTabData.size ? { size: activeTabData.size } : {}),
        }}
        choices={[]}
        onChangeValue={(styleId, styleValue) =>
          onChange(id, {
            ...value,
            blocks: {
              ...value.blocks,
              [activeTabId]: {
                ...(activeTabData || {}),
                ...(styleId === 'align' ? { align: styleValue } : {}),
                ...(styleId === 'size' ? { size: styleValue } : {}),
                ...(styleId === 'customId' ? { id: styleValue } : {}),
                styles: {
                  ...activeTabData?.styles,
                  [styleId]: styleValue,
                },
              },
            },
          })
        }
      />
    </FormFieldWrapper>
  );
};

export default TabsWidget;
