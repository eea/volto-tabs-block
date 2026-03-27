import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import cx from 'classnames';
import { Container, Icon, Image } from 'semantic-ui-react';
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
  const isDecorative = !hideTitle; // if title is visible, asset should be decorative

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
          {...(hideTitle
            ? { role: 'img', 'aria-hidden': 'false', 'aria-label': tabTitle }
            : { 'aria-hidden': 'true' })}
        />
      )}

      {assetType === 'image' && imageObject && (
        <Image
          src={
            isInternalURL(imageObject['@id'])
              ? `${flattenToAppURL(imageObject['@id'])
              }/${imageObject?.image_scales?.image?.[0].scales?.[imageSize]?.download ||
              imageObject?.image_scales?.image?.[0].download
              }`
              : imageObject['@id']
          }
          className={cx('ui', imageSize, 'aligned')}
          alt={hideTitle ? tabTitle : ''} // empty alt when decorative
          aria-hidden={isDecorative ? 'true' : 'false'}
        />
      )}

      {!hideTitle && (
        <div>
          <span className="menu-item-count">{tabIndex}</span>
          <span className="menu-item-text">{tabTitle}</span>
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
    tabOrderRefs, // array of refs from parent for roving focus
    vertical = false, // whether the tablist is vertical
  } = props;

  const { tab, index } = props;
  const tabIndexNum = index + 1;
  const [tabChanged, setTabChanged] = useState(false);
  const defaultTitle = `Tab ${tabIndexNum}`;
  const tabSettings = tabs[tab];
  const { title, assetType } = tabSettings;
  const tabTitle = title || defaultTitle;

  const isSelected = tab === activeTab;
  const tabId = `tab-${tab}`;
  const panelId = `tab-panel-${tab}`;

  useEffect(() => {
    if (
      tabChanged === true &&
      document?.getElementById(blockId)?.querySelector('#' + panelId)
    ) {
      document.getElementById(blockId).querySelector('#' + panelId).focus();
      setTabChanged(false);
    }
  }, [tabChanged, panelId, blockId]);

  const focusTabByIndex = (i) => {
    const ref = tabOrderRefs?.current?.[i];
    if (ref?.current) ref.current.focus();
  };

  const onKeyDown = (e) => {
    const key = e.key;
    const isHorizontal = !vertical;

    // Navigate among tabs WITHOUT activation
    if (
      (isHorizontal && (key === 'ArrowRight' || key === 'ArrowLeft')) ||
      (!isHorizontal && (key === 'ArrowDown' || key === 'ArrowUp')) ||
      key === 'Home' ||
      key === 'End'
    ) {
      e.preventDefault();
      const lastIndex = tabOrderRefs.current.length - 1;

      if (key === 'Home') return focusTabByIndex(0);
      if (key === 'End') return focusTabByIndex(lastIndex);

      let next = index;
      if (isHorizontal) {
        next = key === 'ArrowRight' ? index + 1 : index - 1;
      } else {
        next = key === 'ArrowDown' ? index + 1 : index - 1;
      }
      if (next < 0) next = lastIndex;
      if (next > lastIndex) next = 0;
      focusTabByIndex(next);
      return;
    }

    // Activate current tab
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      if (!isSelected) setActiveTab(tab);
      setTabChanged(true);
    }
  };

  return (
    <React.Fragment>
      {index === 0 && (tabsTitle || tabsDescription) && (
        <li className="menu-title" role="presentation">
          <SimpleMarkdown md={tabsTitle} defaultTag="##" className="title" />
          <SimpleMarkdown md={tabsDescription} className="description" />
        </li>
      )}

      <li className={cx('item', { active: isSelected })} role="presentation">
        <button
          id={tabId}
          type="button"
          className={cx({ active: isSelected })}
          role="tab"
          aria-selected={isSelected}
          aria-controls={panelId}
          tabIndex={isSelected ? 0 : -1} // roving tabindex
          ref={tabOrderRefs.current?.[index]}
          onClick={(e) => {
            e.preventDefault();
            if (!isSelected) {
              setActiveTab(tab);
              setTabChanged(true);
            }
          }}
          onKeyDown={onKeyDown}
        >
          <>
            {assetType ? (
              <AssetTab
                props={tabSettings}
                tabTitle={tabTitle}
                tabIndex={tabIndexNum}
              />
            ) : (
              <>
                <span className="menu-item-count">{tabIndexNum}</span>
                <span className="menu-item-text">{tabTitle}</span>
              </>
            )}
          </>
        </button>
      </li>
    </React.Fragment>
  );
};

const View = (props) => {
  const {
    metadata = {},
    data = {},
    tabsList = [],
    tabs = {},
    activeTab,
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
  const vertical = !!menuPosition.vertical;

  // Refs for roving tabindex; keep refs stable per index across renders
  const tabOrderRefs = React.useRef([]);
  useEffect(() => {
    tabOrderRefs.current = tabsList.map(
      (_, i) => tabOrderRefs.current[i] || React.createRef(),
    );
  }, [tabsList]);

  return (
    <>
      <ul
        role="tablist"
        aria-label={title || 'Tabs'}
        {...(vertical ? { 'aria-orientation': 'vertical' } : {})}
        className={cx(
          'ui menu',
          'tabs-secondary-variant',
          menuAlign,
          {
            [menuPosition.direction === 'left' ? 'border-right' : '']:
              menuPosition.direction === 'left',
            [menuPosition.direction === 'right' ? 'border-left' : '']:
              menuPosition.direction === 'right',
            [menuPosition.direction === 'top' ? 'border-bottom' : '']:
              menuPosition.direction === 'top',
            [menuPosition.direction === 'bottom' ? 'border-top' : '']:
              menuPosition.direction === 'bottom',
            secondary: menuSecondary,
            pointing: menuPointing,
            fluid: menuFluid,
            stackable: menuStackable,
            tabular: menuTabular,
            text: menuText,
            inverted: menuInverted,
            borderless: menuBorderless,
            [menuColor]: !!menuColor,
            [menuSize]: !!menuSize,
            container: isContainer,
            [menuPosition.attached ? `${menuPosition.attached} attached` : '']:
              !!menuPosition.attached,
            vertical: menuPosition.vertical,
          },
        )}
      >
        {tabsList.map((tab, index) => (
          <MenuItem
            {...props}
            key={tab}
            tab={tab}
            index={index}
            tabsTitle={title}
            tabsDescription={description}
            blockId={props?.id || ''}
            activeTab={activeTab}
            tabOrderRefs={tabOrderRefs}
            vertical={vertical}
          />
        ))}
      </ul>

      {tabsList.map((tab) => {
        const isActive = tab === activeTab;
        const panelId = `tab-panel-${tab}`;
        const tabId = `tab-${tab}`;

        const content = (
          <div
            id={tabs[tab]?.title || `Tab ${tabsList.indexOf(tab) + 1}`}
            className="tab-name"
          >
            <div
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId}
              tabIndex={isActive ? 0 : -1}
            >
              <RenderBlocks
                {...props}
                metadata={metadata}
                content={tabs[tab]}
              />
            </div>
          </div>
        );

        return (
          <div
            key={tab}
            className={cx('ui tab', {
              active: isActive,
              // Mimic Semantic UI default tab segment behavior
              segment: true,
              bottom: true,
              attached: true,
              container: isContainer,
            })}
            style={{ display: isActive ? 'block' : 'none' }}
          >
            {isContainer ? <Container>{content}</Container> : content}
          </div>
        );
      })}
    </>
  );
};

export default compose(withScrollToTarget)(withRouter(View));
