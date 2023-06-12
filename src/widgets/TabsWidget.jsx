import React from 'react';
import { v4 as uuid } from 'uuid';
import { omit, without } from 'lodash';
import move from 'lodash-move';
import { Icon, FormFieldWrapper, DragDropList } from '@plone/volto/components';
import { emptyTab } from '@eeacms/volto-tabs-block/helpers';
import { StyleWrapperEdit } from '@eeacms/volto-block-style/StyleWrapper';
import ObjectWidget from '@plone/volto/components/manage/Widgets/ObjectWidget';
import { Accordion, Button, Segment } from 'semantic-ui-react';
import { useIntl } from 'react-intl';

import dragSVG from '@plone/volto/icons/drag.svg';
import themeSVG from '@plone/volto/icons/theme.svg';
import trashSVG from '@plone/volto/icons/delete.svg';
import plusSVG from '@plone/volto/icons/add.svg';
import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';

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
  const { value = {}, id, onChange, schema, schemaExtender } = props;
  const { blocks = {} } = value;
  const tabsList = (value.blocks_layout?.items || []).map((uid) => [
    uid,
    blocks[uid],
  ]);
  const activeTabData = blocks[activeTabId] || {};

  const [localActiveObject, setLocalActiveObject] = React.useState(
    props.activeObject ?? value.length - 1,
  );

  let activeObject, setActiveObject;
  if (
    (props.activeObject || props.activeObject === 0) &&
    props.setActiveObject
  ) {
    activeObject = props.activeObject;
    setActiveObject = props.setActiveObject;
  } else {
    activeObject = localActiveObject;
    setActiveObject = setLocalActiveObject;
  }

  function handleChangeActiveObject(e, blockProps) {
    const { index } = blockProps;
    const newIndex = activeObject === index ? -1 : index;

    setActiveObject(newIndex);
  }
  const intl = useIntl();
  const objectSchema = typeof schema === 'function' ? schema(props) : schema;

  return (
    <div className="objectlist-widget">
      <FormFieldWrapper
        {...props}
        // draggable={false}
        className="drag-drop-list-widget"
      >
        <div className="add-item-button-wrapper">
          <Button
            compact
            icon
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
            title="Add Tab"
          >
            <Icon name={plusSVG} size="18px" />
            &nbsp; Add Tab
          </Button>
        </div>
      </FormFieldWrapper>

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
                <Accordion key={index} fluid styled>
                  <Accordion.Title
                    active={activeObject === index}
                    index={index}
                    onClick={handleChangeActiveObject}
                  >
                    <div
                      style={{
                        visibility: 'visible',
                        display: 'inline-block',
                      }}
                      {...draginfo.dragHandleProps}
                      className="drag handle"
                    >
                      <Icon name={dragSVG} size="18px" />
                    </div>
                    <div className="label">{`Tab #${index + 1}`}</div>

                    <div className="accordion-tools">
                      <button
                        onClick={() => {
                          setActiveTabId(childId);
                          setBlockStyleVisible(true);
                        }}
                        title="Apply style"
                      >
                        <Icon name={themeSVG} size="20px" />
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
                          <Icon name={trashSVG} size="20px" color="#e40166" />
                        </button>
                      ) : (
                        ''
                      )}
                      {activeObject === index ? (
                        <Icon name={upSVG} size="20px" />
                      ) : (
                        <Icon name={downSVG} size="20px" />
                      )}
                    </div>
                  </Accordion.Title>
                  <Accordion.Content active={activeObject === index}>
                    <Segment>
                      <ObjectWidget
                        id={`${id}-${index}`}
                        key={`ow-${id}-${index}`}
                        block={props.block}
                        schema={
                          schemaExtender
                            ? schemaExtender(schema, child, intl)
                            : objectSchema
                        }
                        value={child}
                        onChange={(fi, fv) => {
                          onChange(id, {
                            ...value,
                            blocks: {
                              ...value.blocks,
                              [childId]: fv,
                            },
                            blocks_layout: {
                              ...value.blocks_layout,
                            },
                          });
                        }}
                      />
                    </Segment>
                  </Accordion.Content>
                </Accordion>
              </div>
            );
          }}
        </DragDropList>
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
    </div>
  );
};

export default TabsWidget;
