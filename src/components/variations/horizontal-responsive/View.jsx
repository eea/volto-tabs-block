import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Tab, Container, Dropdown } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import {
    SimpleMarkdown,
    getMenuPosition,
    positionedOffset,
    toggleItem,
} from '@eeacms/volto-tabs-block/utils';

import '@eeacms/volto-tabs-block/less/menu.less';

import noop from 'lodash/noop';

const MenuItem = (props) => {
    const { activeTab = null, tabs = {}, setActiveTab = noop, blockId } = props;
    const { tabsTitle, tabsDescription, tab, index } = props;
    const title = tabs[tab].title;
    const tabIndex = index + 1;
    const defaultTitle = `Tab ${tabIndex}`;
    const [tabChanged, setTabChanged] = useState(false);

    useEffect(() => {
        if (
            tabChanged === true &&
            document?.getElementById(blockId)?.querySelector('#tab-pane-' + tab)
        ) {
            document
                .getElementById(blockId)
                .querySelector('#tab-pane-' + tab)
                .focus();
            setTabChanged(false);
        }
    }, [tabChanged, tab, blockId]);

    const tabId = `tab-${blockId}-${tab}`;
    const panelId = `tab-pane-${tab}`;

    return (
        <React.Fragment>
            {index === 0 && (tabsTitle || tabsDescription) && (
                <li className="menu-title" role="presentation">
                    <div
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (
                                    document
                                        .getElementById(blockId)
                                        ?.getElementsByClassName('active tab')?.length > 0
                                ) {
                                    const tabDiv = document
                                        .getElementById(blockId)
                                        .getElementsByClassName('active tab')[0];
                                    tabDiv.focus();
                                }
                                if (activeTab !== tab) {
                                    setActiveTab(tab);
                                }
                            }
                        }}
                    >
                        <SimpleMarkdown md={tabsTitle} defaultTag="##" className="title" />
                        <SimpleMarkdown md={tabsDescription} className="description" />
                    </div>
                </li>
            )}
            <li role="presentation">
                <button
                    id={tabId}
                    role="tab"
                    aria-selected={tab === activeTab}
                    aria-controls={panelId}
                    tabIndex={tab === activeTab ? 0 : -1}
                    className={cx('item', {
                        active: tab === activeTab,
                    })}
                    data-tab={tab}
                    onClick={() => {
                        if (activeTab !== tab) {
                            setActiveTab(tab);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (activeTab !== tab) {
                                setActiveTab(tab);
                            }
                            setTabChanged(true);
                        }
                    }}
                >
                    <span className={'menu-item-count'}>{tabIndex}</span>
                    <span className={'menu-item-text'}>{title || defaultTitle}</span>
                </button>
            </li>
        </React.Fragment>
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
        setActiveTab = noop,
    } = props;
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (!node?.current) return;
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
            <ul
                role="tablist"
                aria-label="Content tabs"
                className="menu-wrapper tabs-accessibility"
            >
                {panes.map((pane, index) => (
                    <React.Fragment key={`menu-item-${index}-${pane.id}`}>
                        {pane.menuItem}
                    </React.Fragment>
                ))}
            </ul>
            <Dropdown
                icon="ellipsis horizontal"
                className="item"
                pointing="top right"
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
            >
                <Dropdown.Menu>
                    {tabsList.map((underlineTab, underlineIndex) => {
                        const title = tabs[underlineTab].title;
                        const defaultTitle = `Tab ${underlineIndex + 1}`;

                        return (
                            <Dropdown.Item
                                hidden
                                key={`underline-tab-${underlineIndex}-${underlineTab}`}
                                underline-item-data={underlineTab}
                                active={underlineTab === activeTab}
                                onClick={() => {
                                    if (activeTab !== underlineTab) {
                                        setActiveTab(underlineTab);
                                    }
                                }}
                            >
                                <span className={'menu-item-count'}>{underlineIndex + 1}</span>
                                <span className={'menu-item-text'}>
                                    {title || defaultTitle}
                                </span>
                            </Dropdown.Item>
                        );
                    })}
                </Dropdown.Menu>
            </Dropdown>
        </React.Fragment>
    );
};

const View = (props) => {
    const {
        metadata = {},
        data = {},
        tabsList = [],
        tabs = {},
        activeTabIndex = 0,
        screen,
    } = props;
    const menuPosition = getMenuPosition(data);

    const {
        title,
        description,
        align,
        menuBorderless,
        menuColor,
        menuCompact,
        menuFluid,
        menuInverted,
        menuPointing,
        menuSecondary,
        menuSize,
        menuStackable,
        menuTabular,
        menuText,
        menuAlign,
    } = data;
    const isContainer = align === 'full';

    const panes = tabsList.map((tab, index) => {
        const tabId = `tab-${props.id}-${tab}`;
        const panelId = `tab-pane-${tab}`;

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
                    tabsTitle={title}
                    tabsDescription={description}
                />
            ),
            pane: (
                <Tab.Pane key={tab} as={isContainer ? Container : undefined}>
                    <div
                        id={tabs[tab]?.title || `Tab ${tabsList.indexOf(tab) + 1}`}
                        className="tab-name"
                    >
                        <div
                            tabIndex={0}
                            role="tabpanel"
                            id={panelId}
                            aria-labelledby={tabId}
                        >
                            <RenderBlocks
                                {...props}
                                metadata={metadata}
                                content={tabs[tab]}
                            />
                        </div>
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
                    borderless: menuBorderless,
                    color: menuColor,
                    compact: menuCompact,
                    fluid: menuFluid,
                    inverted: menuInverted,
                    pointing: menuPointing,
                    secondary: menuSecondary,
                    size: menuSize,
                    stackable: menuStackable,
                    tabular: menuTabular,
                    text: menuText,
                    vertical: menuPosition.vertical,
                    className: cx(menuAlign, { container: isContainer }),
                    children: (
                        <MenuWrapper
                            {...props}
                            panes={panes}
                            menuPosition={menuPosition}
                            screen={screen}
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
)(withRouter(View));
