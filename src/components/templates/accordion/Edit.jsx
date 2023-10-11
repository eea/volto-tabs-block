import React from 'react';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { useIntl } from 'react-intl';
import { v4 as uuid } from 'uuid';
import Tabs from 'react-responsive-tabs';
import AnimateHeight from 'react-animate-height';
import EditBlockWrapper from '@eeacms/volto-tabs-block/components/EditBlockWrapper';
import { emptyBlocksForm } from '@plone/volto/helpers';
import { Menu, Input, Image, Icon } from 'semantic-ui-react';
import { Icon as VoltoIcon, BlocksForm } from '@plone/volto/components';
import config from '@plone/volto/registry';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { getParentTabFromHash } from '@eeacms/volto-tabs-block/helpers';
import noop from 'lodash/noop';

import '@eeacms/volto-tabs-block/less/menu.less';

const MenuItem = (props) => {
  const inputRef = React.useRef(null);
  const intl = useIntl();
  const {
    schema,
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
  const tabIndex = index + 1;
  const defaultTitle = `Tab ${tabIndex}`;
  const {
    title,
    icon,
    image,
    assetPosition,
    assetType,
    iconSize,
    imageSize,
    hideTitle,
  } = tabs[tab];
  const tabTitle = title || defaultTitle;

  const addNewTab = () => {
    const tabId = uuid();

    onChangeBlock(block, {
      ...data,
      data: {
        ...tabsData,
        blocks: {
          ...tabsData.blocks,
          [tabId]: {
            ...emptyTab({
              schema: schema.properties.data.schema,
              intl,
            }),
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
        <div className="menu-title"></div>
      )}

      <Menu.Item
        role="tab"
        aria-hidden="true"
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
        className="remove-margin"
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
            {assetType ? (
              <div
                className={cx('tab-with-icon', {
                  'asset-top': assetPosition === 'top',
                  'asset-left': assetPosition === 'left',
                  'asset-right': assetPosition === 'right',
                })}
              >
                {assetType === 'icon' && icon && (
                  <Icon
                    className={cx('tab-icon aligned', icon, iconSize)}
                    size={iconSize}
                    {...{
                      ...(hideTitle && {
                        role: 'img',
                        'aria-hidden': 'false',
                        'aria-label': tabTitle,
                      }),
                    }}
                  />
                )}

                {assetType === 'image' && image && (
                  <Image
                    src={`${image}/@@images/image/${imageSize}`}
                    className={cx('ui', imageSize, 'aligned')}
                    alt={hideTitle ? tabTitle : ''}
                  />
                )}

                {!hideTitle && (
                  <span className="menu-item-text">{tabTitle}</span>
                )}
              </div>
            ) : (
              <span>{title || defaultTitle}</span>
            )}
          </>
        )}
      </Menu.Item>
      {index === tabsList.length - 1 ? (
        <>
          <Menu.Item
            role="tab"
            aria-hidden="true"
            name="addition"
            onClick={() => {
              addNewTab();
              setEditingTab(null);
            }}
            className="remove-margin addition-button"
          >
            <p className="menu-item-text">+</p>
          </Menu.Item>
        </>
      ) : (
        ''
      )}
    </>
  );
};

class Tab extends React.Component {
  constructor() {
    super();
    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    if (this.state.height === 0) {
      requestAnimationFrame(() => {
        this.setState({ height: 'auto' });
      });
    }
  }

  render() {
    return (
      <AnimateHeight
        animateOpacity
        duration={500}
        height={this.state.height}
        aria-hidden={false}
      >
        {this.props.children}
      </AnimateHeight>
    );
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

  const { description, menuInverted, menuSecondary, menuPointing } = data;
  const accordionConfig = config.blocks.blocksConfig[
    TABS_BLOCK
  ].variations.filter((v, i) => v.id === data.variation);
  const { icons, semanticIcon, transformWidth = 800 } = accordionConfig?.[0];

  const tabsContainer = React.useRef();
  const [mounted, setMounted] = React.useState(false);
  const [hashTab, setHashTab] = React.useState(false);
  const [initialWidth, setInitialWidth] = React.useState(transformWidth);

  const items = tabsList.map((tab, index) => {
    const title = tabs[tab]?.title;
    const defaultTitle = `Tab ${index + 1}`;
    const active = activeTabIndex === index;
    const tabsDescription = description;

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
            tabsTitle={title || defaultTitle}
            tabsDescription={tabsDescription}
            schema={schema}
          />
        </>
      ),
      content: (
        <Tab {...props} tab={tab} content={tabs[tab]} aria-hidden={false}>
          <BlocksForm
            allowedBlocks={data?.allowedBlocks}
            description={data?.instrunctions?.data}
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
      onChange={(tab) => {
        const { blockWidth } = tabsContainer.current?.state || {};
        const tabWithHash = getParentTabFromHash(
          data,
          props?.location?.hash.substring(1),
        );
        if (tabWithHash === tabsList[activeTabIndex] && !hashTab)
          setHashTab(true);
        else if (tab !== tabsList[activeTabIndex]) {
          setActiveTab(tab);
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
