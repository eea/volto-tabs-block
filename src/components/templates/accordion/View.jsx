import React from 'react';
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
      <AnimateHeight animateOpacity duration={500} height={this.state.height}>
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
  } = props;
  const tabsContainer = React.useRef();
  const [initialWidth, setInitialWidth] = React.useState(
    config.blocks.blocksConfig[TABS_BLOCK].templates?.['accordion']
      ?.transformWidth,
  );

  console.log('HERE', initialWidth);

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

  const accordionConfig =
    config.blocks.blocksConfig.tabs_block.templates.accordion;
  const { icons, semanticIcon } = accordionConfig;

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
      getContent: () => <Tab {...props} tab={tab} content={tabs[tab]} />,
      key: tab,
      tabClassName: cx('ui button item title', { active }),
      panelClassName: cx('ui bottom attached segment tab', {
        active,
      }),
    };
  });

  React.useEffect(() => {
    setInitialWidth(
      tabsContainer.current?.tabsWrapper?.current?.offsetWidth || 800,
    );
  }, []);

  return (
    <>
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
          getDataValue('menuColor'),
          {
            inverted: getDataValue('menuInverted'),
          },
        )}
        showMore={false}
      />
    </>
  );
};

export default compose(withScrollToTarget, withRouter)(View);
