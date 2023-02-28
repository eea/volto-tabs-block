import React, { useLayoutEffect } from 'react';
import cx from 'classnames';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import Tabs from 'react-responsive-tabs';
import AnimateHeight from 'react-animate-height';
import { Icon } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import { Icon as VoltoIcon, RenderBlocks } from '@plone/volto/components';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';

import 'react-responsive-tabs/styles.css';
import '@eeacms/volto-tabs-block/less/menu.less';

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
        <RenderBlocks {...this.props} />
      </AnimateHeight>
    );
  }
}

const View = (props) => {
  const {
    data = {},
    tabsList = [],
    tabs = {},
    activeTabIndex = 0,
    setActiveTab = () => {},
    id,
  } = props;

  const accordionConfig =
    config.blocks.blocksConfig[TABS_BLOCK].templates?.['accordion'] || {};
  const { icons, semanticIcon, transformWidth = 800 } = accordionConfig;

  const tabsContainer = React.useRef();
  const [mounted, setMounted] = React.useState(false);
  const [initialWidth, setInitialWidth] = React.useState(transformWidth);

  const schema = React.useMemo(
    () =>
      config.blocks.blocksConfig[TABS_BLOCK].templates?.['default']?.schema(
        config,
        props,
      ) || {},
    [props],
  );

  const getDataValue = React.useCallback(
    (key) => {
      return (
        (schema.properties[key]?.value || data[key]) ??
        schema.properties[key]?.defaultValue
      );
    },
    [schema, data],
  );

  const items = tabsList.map((tab, index) => {
    const title = tabs[tab].title;
    const defaultTitle = `Tab ${index + 1}`;
    const active = activeTabIndex === index;

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
          {title || defaultTitle}{' '}
        </>
      ),
      getContent: () => (
        <Tab {...props} tab={tab} content={tabs[tab]} aria-hidden={false} />
      ),
      key: tab,
      tabClassName: cx('ui button item title', { active }),
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
      activeTabDiv.setAttribute('className', 'accesibilty-accordion-tab');
      activeTabDiv.focus();
    }
  }, [activeTabIndex]);
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
        className="tabs aa"
        selectedTabKey={tabsList[activeTabIndex]}
        items={items}
        onChange={(tab) => {
          if (tab !== tabsList[activeTabIndex]) {
            setActiveTab(tab);
          } else {
            setActiveTab(null);
          }
        }}
        tabsWrapperClass={cx(
          'ui pointing secondary menu',
          'tabs-accessibility',
          getDataValue('menuColor'),
          {
            inverted: getDataValue('menuInverted'),
          },
        )}
        showMore={false}
      />
    </div>
  );
};

export default compose(withScrollToTarget, withRouter)(View);
