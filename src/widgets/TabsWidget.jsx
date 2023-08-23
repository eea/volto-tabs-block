import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { omit, without } from 'lodash';
import move from 'lodash-move';
import { Icon, FormFieldWrapper, DragDropList } from '@plone/volto/components';
import { emptyTab } from '@eeacms/volto-tabs-block/helpers';
import { StyleWrapperEdit } from '@eeacms/volto-block-style/StyleWrapper';
import dragSVG from '@plone/volto/icons/drag.svg';
import themeSVG from '@plone/volto/icons/theme.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import plusSVG from '@plone/volto/icons/circle-plus.svg';

const messages = defineMessages({
  ApplyStyle: {
    id: 'apply-style',
    defaultMessage: 'Apply style',
  },
  DeleteTab: {
    id: 'delete-tab',
    defaultMessage: 'Delete tab',
  },
  AddNewTab: {
    id: 'add-new-tab',
    defaultMessage: 'Add new tab',
  },
  DefaultTitle: {
    id: 'default-title',
    defaultMessage: 'Tab {tabTitle}',
  },
});

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
  const intl = useIntl();
  const [blockStyleVisible, setBlockStyleVisible] = React.useState(false);
  const [activeTabId, setActiveTabId] = React.useState(0);
  const { value = {}, id, onChange } = props;
  const { blocks = {} } = value;
  const tabsList = (value.blocks_layout?.items || []).map((uid) => [
    uid,
    blocks[uid],
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
                      {child.title ||
                        intl.formatMessage(messages.DefaultTitle, {
                          tabTitle: `${index + 1}`,
                        })}
                    </div>
                    <button
                      onClick={() => {
                        setActiveTabId(childId);
                        setBlockStyleVisible(true);
                      }}
                      title={intl.formatMessage(messages.ApplyStyle)}
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
                        title={intl.formatMessage(messages.DeleteTab)}
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
          title={intl.formatMessage(messages.AddNewTab)}
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
