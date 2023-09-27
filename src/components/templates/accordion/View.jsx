import React, { useLayoutEffect } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import Tabs from 'react-responsive-tabs';
import AnimateHeight from 'react-animate-height';
import { Icon, Image } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { Icon as VoltoIcon, RenderBlocks } from '@plone/volto/components';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import { getParentTabFromHash } from '@eeacms/volto-tabs-block/helpers';
import noop from 'lodash/noop';

import { withResizeDetector } from 'react-resize-detector';

import '@eeacms/volto-tabs-block/less/menu.less';

class Tab extends React.Component {
  constructor() {
    super();
    this.animateId = null;
    this.state = {
      height: 0,
    };
  }

  componentDidMount() {
    if (this.state.height === 0) {
      this.animateId = requestAnimationFrame(() => {
        this.setState({ height: 'auto' });
      });
    }
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.animateId);
  }

  render() {
    return (
      <div id={this.props.title} className="tab-name">
        <AnimateHeight
          animateOpacity
          duration={500}
          height={this.state.height}
          aria-hidden={false}
        >
          <RenderBlocks {...this.props} />
        </AnimateHeight>
      </div>
    );
  }
}

const View = (props) => {
  const {
    data = {},
    tabsList = [],
    tabs = {},
    activeTabIndex = 0,
    setActiveTab = noop,
    width,
    id,
  } = props;

  const accordionConfig = config.blocks.blocksConfig[
    TABS_BLOCK
  ].variations.filter((v, i) => v.id === 'accordion');
  const { icons, semanticIcon, transformWidth = 800 } = accordionConfig?.[0];

  const tabsContainer = React.useRef();
  const [mounted, setMounted] = React.useState(false);
  const [hashTab, setHashTab] = React.useState(false);
  const [initialWidth, setInitialWidth] = React.useState(transformWidth);
  const tabs_width = tabsContainer?.current?.state?.blockWidth || initialWidth;
  const [isAccordion, setIsAccordion] = React.useState(
    tabs_width < initialWidth,
  );

  const items = tabsList.map((tab, index) => {
    const defaultTitle = `Tab ${index + 1}`;
    const active = activeTabIndex === index;
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

    return {
      title: (
        <>
          {semanticIcon ? (
            <Icon
              className={active ? semanticIcon.opened : semanticIcon.closed}
            />
          ) : (
            <VoltoIcon
              name={active ? icons.opened : icons.closed}
              size={icons.size}
            />
          )}
          <span>{title || defaultTitle} </span>
          <div
            className={cx({
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
                alt="Tab image"
              />
            )}

            {!hideTitle && <p className="menu-item-text">{tabTitle}</p>}
          </div>
        </>
      ),
      content: (
        <Tab
          {...props}
          tab={tab}
          content={tabs[tab]}
          aria-hidden={false}
          title={tabs[tab]?.title || `Tab ${tabsList.indexOf(tab) + 1}`}
        />
      ),
      key: tab,
      tabClassName: cx(
        {
          active,
        },
        isAccordion ? 'title accordion-title' : 'ui item title',
      ),
      panelClassName: cx('ui attached segment tab content', {
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

  React.useEffect(() => {
    setIsAccordion(width <= initialWidth);
  }, [width, initialWidth]);

  useLayoutEffect(() => {
    if (document.activeElement.role !== 'tab') return;
    if (
      document.getElementById(id)?.getElementsByClassName('tab active').length >
      0
    ) {
      let activeTabDiv = document
        .getElementById(id)
        .getElementsByClassName('tab active')[0];
      activeTabDiv.setAttribute('tabindex', '0');
      activeTabDiv.setAttribute('className', 'accessibility-accordion-tab');
      activeTabDiv.focus();
    }
  }, [activeTabIndex, id]);

  return (
    <div
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const focusedElement = document.activeElement;
          if (focusedElement) focusedElement.click();
        }
      }}
      role="tab"
    >
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
            props.location.hash.substring(1),
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
          props?.data?.accordionIconRight
            ? 'tabs-accordion-icon-right'
            : 'tabs-accordion-icon-left',
          isAccordion
            ? 'ui accordion tabs-accessibility'
            : 'ui menu tabs-accessibility tabs-secondary-variant',
          data?.theme ? `${data?.theme}` : '',
          {
            inverted: data.menuInverted,
          },
          {
            pointing: data.menuPointing,
          },
          {
            secondary: data.menuSecondary,
          },
        )}
        showMore={false}
      />
    </div>
  );
};

export default compose(
  withScrollToTarget,
  withResizeDetector,
  withRouter,
)(View);
