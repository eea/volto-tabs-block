import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Menu, Tab, Container, Icon, Image } from 'semantic-ui-react';
import { RenderBlocks } from '@plone/volto/components';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import {
  SimpleMarkdown,
  getMenuPosition,
} from '@eeacms/volto-tabs-block/utils';

import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers';

import '@eeacms/volto-tabs-block/less/menu.less';

import noop from 'lodash/noop';

export const AssetTab = ({ props, tabIndex, tabTitle }) => {
  const {
    icon,
    image,
    assetType,
    assetPosition,
    iconSize,
    imageSize,
    hideTitle,
  } = props;
  const imageObject = image?.[0];
  return (
    <div
      className={cx('asset-position', {
        'asset-top': assetPosition === 'top',
        'asset-left': assetPosition === 'left',
        'asset-right': assetPosition === 'right',
      })}
    >
      {assetType === 'icon' && icon && (
        <Icon
          className={cx('tab-icon', icon, iconSize, 'aligned')}
          {...{
            ...(hideTitle && {
              role: 'img',
              'aria-hidden': 'false',
              'aria-label': tabTitle,
            }),
          }}
        />
      )}

      {assetType === 'image' && imageObject && (
        <Image
          src={
            isInternalURL(imageObject['@id'])
              ? `${flattenToAppURL(imageObject['@id'])}/${
                  imageObject?.image_scales?.image?.[0].scales?.[imageSize]
                    ?.download || imageObject?.image_scales?.image?.[0].download
                }`
              : imageObject['@id']
          }
          className={cx('ui', imageSize, 'aligned')}
          alt={hideTitle ? tabTitle : ''}
        />
      )}

      {!hideTitle && (
        <div>
          <span className="menu-item-count">{tabIndex}</span>
          <p className="menu-item-text">{tabTitle}</p>
        </div>
      )}
    </div>
  );
};

const MenuItem = (props) => {
  const {
    activeTab = null,
    tabs = {},
    setActiveTab = noop,
    tabsTitle,
    tabsDescription,
    blockId,
  } = props;

  const { tab, index } = props;
  const tabIndex = index + 1;
  const [tabChanged, setTabChanged] = useState(false);
  const defaultTitle = `Tab ${tabIndex}`;
  const tabSettings = tabs[tab];
  const { title, assetType } = tabSettings;
  const tabTitle = title || defaultTitle;

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

  return (
    <React.Fragment>
      {index === 0 && (tabsTitle || tabsDescription) && (
        <Menu.Item className="menu-title">
          <SimpleMarkdown md={tabsTitle} defaultTag="##" className="title" />
          <SimpleMarkdown md={tabsDescription} className="description" />
        </Menu.Item>
      )}
      <Menu.Item
        name={defaultTitle}
        active={tab === activeTab}
        aria-selected={tab === activeTab}
        tabIndex={0}
        role={'tab'}
        onClick={() => {
          if (activeTab !== tab) {
            setActiveTab(tab);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (activeTab !== tab) {
              setActiveTab(tab);
            }
            setTabChanged(true);
          }
        }}
      >
        <>
          {assetType ? (
            <AssetTab
              props={tabSettings}
              tabTitle={tabTitle}
              tabIndex={tabIndex}
            />
          ) : (
            <>
              <span className="menu-item-count">{tabIndex}</span>
              <p className="menu-item-text">{tabTitle}</p>
            </>
          )}
        </>
      </Menu.Item>
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
  } = props;
  const [menuPosition, setMenuPosition] = React.useState({});
  React.useEffect(() => {
    if (Object.keys(menuPosition).length === 0) {
      setMenuPosition(getMenuPosition(data));
    }
  }, [data, menuPosition]);

  const {
    title,
    description,
    align,
    menuBorderless,
    menuColor,
    menuCompact = true,
    menuFluid = true,
    menuInverted,
    menuPointing,
    menuSecondary,
    menuSize,
    menuStackable,
    menuTabular,
    menuText = true,
    menuAlign,
  } = data;
  const isContainer = align === 'full';

  const panes = tabsList.map((tab, index) => {
    return {
      id: tab,
      menuItem: (
        <MenuItem
          {...props}
          key={tab}
          tab={tab}
          index={index}
          tabsTitle={title}
          tabsDescription={description}
          blockId={props?.id || ''}
        />
      ),
      pane: (
        <Tab.Pane key={tab} as={isContainer ? Container : undefined}>
          <div
            id={tabs[tab]?.title || `Tab ${tabsList.indexOf(tab) + 1}`}
            className="tab-name"
          >
            <div tabIndex={0} role="tabpanel" id={'tab-pane-' + tab}>
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
        className="default tabs tabs-accessibility"
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
          className: cx(
            menuAlign,
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

export default compose(withScrollToTarget)(withRouter(View));
