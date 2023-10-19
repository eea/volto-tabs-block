import React from 'react';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';
import Tabs from 'react-responsive-tabs';
import EditBlockWrapper from '@eeacms/volto-tabs-block/components/EditBlockWrapper';
import { MenuItem } from '@eeacms/volto-tabs-block/components/templates/default/Edit';
import { emptyBlocksForm } from '@plone/volto/helpers';
import { Icon } from 'semantic-ui-react';
import { Icon as VoltoIcon, BlocksForm } from '@plone/volto/components';
import config from '@plone/volto/registry';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { getParentTabFromHash } from '@eeacms/volto-tabs-block/helpers';
import noop from 'lodash/noop';

import '@eeacms/volto-tabs-block/less/menu.less';

class Tab extends React.Component {
  render() {
    return this.props.children;
  }
}

const Edit = (props) => {
  const intl = useIntl();
  const {
    data = {},
    tabsList = [],
    tabs = {},
    activeTabIndex = 0,
    setActiveTab = noop,
    editingTab = null,
    activeBlock = null,
    activeTab = null,
    block = null,
    setEditingTab = noop,
    multiSelected = [],
    manage = false,
    metadata = null,
    selected = false,
    onChangeBlock = noop,
    onChangeTabData = noop,
    onSelectBlock = noop,
    emptyTab = noop,
    tabsData = {},
    schema,
  } = props;

  const { menuInverted, menuSecondary, menuPointing } = data;
  const accordionConfig = config.blocks.blocksConfig[
    TABS_BLOCK
  ].variations.filter((v, _i) => v.id === data.variation);
  const { icons, semanticIcon, transformWidth = 800 } = accordionConfig?.[0];

  const tabsContainer = React.useRef();
  const [mounted, setMounted] = React.useState(false);
  const [hashTab, setHashTab] = React.useState(false);
  const [initialWidth, setInitialWidth] = React.useState(transformWidth);

  const items = tabsList.map((tab, index) => {
    const active = activeTabIndex === index;

    return {
      title: (
        <>
          {semanticIcon ? (
            <div className="tabs-icon">
              <Icon
                className={active ? semanticIcon.opened : semanticIcon.closed}
              />
            </div>
          ) : (
            <div className="tabs-icon">
              <VoltoIcon
                name={active ? icons.opened : icons.closed}
                size={icons.size}
                className="tabs-icon"
              />
            </div>
          )}
          <MenuItem
            {...props}
            key={tab}
            editingTab={editingTab}
            index={index}
            setEditingTab={setEditingTab}
            tab={tab}
            schema={schema}
          />
        </>
      ),
      content: (
        <Tab {...props} tab={tab} content={tabs[tab]} aria-hidden={false}>
          <BlocksForm
            allowedBlocks={data?.allowedBlocks}
            description={data?.instructions?.data}
            manage={manage}
            metadata={metadata}
            pathname={props.pathname}
            properties={isEmpty(tabs[tab]) ? emptyBlocksForm() : tabs[tab]}
            selected={selected && activeTab === tab && activeBlock}
            selectedBlock={
              selected && activeTab === tab && activeBlock ? activeBlock : null
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
                        : emptyTab({
                            schema: schema.properties.data.schema,
                            intl,
                          })),
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
        </Tab>
      ),
      key: tab,
      tabClassName: cx('ui button item title', { active }, 'remove-menu'),
      panelClassName: cx('ui bottom attached segment tab', {
        active,
      }),
    };
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    if (!mounted) return;
    const { blockWidth, tabsTotalWidth } = tabsContainer.current?.state || {};
    setInitialWidth(
      tabsTotalWidth < blockWidth ? tabsTotalWidth + 1 : blockWidth + 1,
    );
  }, [mounted]);

  return (
    <Tabs
      ref={tabsContainer}
      transformWidth={initialWidth}
      selectedTabKey={tabsList[activeTabIndex]}
      unmountOnExit={false}
      items={items}
      onChange={() => {
        const { blockWidth } = tabsContainer.current?.state || {};
        const tabWithHash = getParentTabFromHash(
          data,
          props?.location?.hash.substring(1),
        );
        if (tabWithHash === tabsList[activeTabIndex] && !hashTab) {
          setHashTab(true);
        } else if (blockWidth <= initialWidth) {
          setActiveTab(null);
        }
      }}
      tabsWrapperClass={cx(
        props?.data?.accordionIconRight ? 'tabs-accordion-icon-right' : '',
        'ui fluid menu tabs-secondary-variant',
        'tabs-accessibility',
        data?.theme ? `${data?.theme}` : '',
        {
          inverted: menuInverted,
        },
        {
          pointing: menuPointing,
        },
        {
          secondary: menuSecondary,
        },
      )}
      showMore={false}
    />
  );
};

Edit.schemaEnhancer = ({ schema }) => {
  schema.fieldsets.splice(1, 0, {
    id: 'menu',
    title: 'Menu',
    fields: [
      'menuInverted',
      'menuSecondary',
      'menuPointing',
      'accordionIconRight',
    ],
  });

  schema.fieldsets.splice(2, 0, {
    id: 'style',
    title: 'Style',
    fields: ['theme'],
  });

  schema.properties = {
    ...schema.properties,
    accordionIconRight: {
      title: 'Icon position on the right',
      description: 'Position left/right of the icon in the accordion tab',
      type: 'boolean',
    },
    menuInverted: {
      title: 'Inverted',
      type: 'boolean',
    },
    menuSecondary: {
      title: 'Secondary',
      type: 'boolean',
      default: true,
    },
    menuPointing: {
      title: 'Pointing',
      type: 'boolean',
      default: true,
    },
    theme: {
      title: 'Theme',
      description: 'Set the theme for the accordion tabs block',
      widget: 'theme_picker',
      colors: [
        ...(config.settings && config.settings.themeColors
          ? config.settings.themeColors.map(({ value, title }) => ({
              name: value,
              label: title,
            }))
          : []),
      ],
    },
  };
  return schema;
};

export default Edit;
