import React from 'react';
import cx from 'classnames';
import { Menu, Tab } from 'semantic-ui-react';
import { defaultSchemaEnhancer } from '@eeacms/volto-tabs-block/components/templates/default/schema';
import { AssetTab } from '@eeacms/volto-tabs-block/components';
import { getMenuPosition } from '@eeacms/volto-tabs-block/utils';

import '@eeacms/volto-tabs-block/less/menu.less';

import noop from 'lodash/noop';

export const MenuItem = (props) => {
  const { tabs = {} } = props;
  const { tab, index } = props;
  const tabIndex = index + 1;
  const defaultTitle = `Tab ${tabIndex}`;
  const tabSettings = tabs[tab];
  const { title, assetType } = tabSettings;
  const tabTitle = title || defaultTitle;

  return (
    <>
      <Menu.Item className="remove-margin">
        <>
          {assetType ? (
            <AssetTab
              props={tabSettings}
              tabTitle={tabTitle}
              tabIndex={tabIndex}
            />
          ) : (
            <span>{tabTitle}</span>
          )}
        </>
      </Menu.Item>
    </>
  );
};

const Edit = (props) => {
  const {
    data = {},
    tabsList = [],
    setEditingTab = noop,
    schema,
    skipColorOption = false,
    customTabsClass = '',
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
    return {
      id: tab,
      menuItem: (
        <MenuItem
          {...props}
          key={tab}
          index={index}
          setEditingTab={setEditingTab}
          tab={tab}
          tabsTitle={title}
          tabsDescription={description}
          schema={schema}
        />
      ),
    };
  });
  return (
    <>
      <Tab
        className={cx('default tabs', customTabsClass)}
        menu={{
          attached: menuPosition.attached,
          borderless: menuBorderless,
          color: !skipColorOption && menuColor,
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
            'tabs-secondary-variant',
            data.menuAlign,
            menuAlign,
            menuPosition.direction === 'left' ? 'border-right' : '',
            menuPosition.direction === 'right' ? 'border-left' : '',
            menuPosition.direction === 'top' ? 'border-bottom' : '',
            menuPosition.direction === 'bottom' ? 'border-top' : '',
            { container: isContainer },
            props.addTabsOptions ? props.addTabsOptions(data) : '',
          ),
        }}
        menuPosition={menuPosition.direction}
        panes={panes}
        grid={{ paneWidth: 9, tabWidth: 3 }}
      />
    </>
  );
};

Edit.schemaEnhancer = defaultSchemaEnhancer;

export default Edit;
