import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import loadable from '@loadable/component';
import { Menu } from 'semantic-ui-react';
import { RenderBlocks, Icon } from '@plone/volto/components';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';
import cx from 'classnames';

import scrollSVG from '@eeacms/volto-tabs-block/icons/scroll.svg';

import '@eeacms/volto-tabs-block/less/carousel.less';

const Slider = loadable(() => import('react-slick'));

const View = (props) => {
  const slider = React.useRef(null);
  const [hashlinkOnMount, setHashlinkOnMount] = React.useState(false);
  const {
    metadata = {},
    data = {},
    tabsList = [],
    // tabs = {},
    tabData = {},
    // activeTab = null,
    activeTabIndex = 0,
    hashlink = {},
    setActiveTab = () => {},
  } = props;
  const theme = data.theme || 'light';
  const hasScrollIcon = data.hasScrollIcon || false;
  const uiContainer = data.align === 'full' ? 'ui container' : false;

  const settings = {
    speed: 400,
    arrows: false,
    swipe: true,
    touchMove: true,
    autoplay: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    lazyLoad: 'ondemand',
    adaptiveHeight: true,
    beforeChange: (oldIndex, index) => {
      setActiveTab(tabsList[index]);
    },
  };

  React.useEffect(() => {
    const urlHash = props.location.hash.substring(1) || '';
    if (
      hashlink.counter > 0 ||
      (hashlink.counter === 0 && urlHash && !hashlinkOnMount)
    ) {
      const id = hashlink.hash || urlHash || '';
      const index = tabsList.indexOf(id);
      const parentId = data.id || props.id;
      const parent = document.getElementById(parentId);
      const headerWrapper = document.querySelector('.header-wrapper');
      const offsetHeight = headerWrapper?.offsetHeight || 0;
      if (id !== parentId && index > -1 && parent) {
        if (activeTabIndex !== index) {
          slider.current.slickGoTo(index);
        }
        props.scrollToTarget(parent, offsetHeight);
      } else if (id === parentId && parent) {
        props.scrollToTarget(parent, offsetHeight);
      }
    }
    if (!hashlinkOnMount) {
      setHashlinkOnMount(true);
    }
    /* eslint-disable-next-line */
  }, [hashlink.counter]);

  const panes = tabsList.map((tab, index) => {
    return {
      id: tab,
      renderItem: (
        <RenderBlocks {...props} metadata={metadata} content={tabData} />
      ),
    };
  });

  return (
    <>
      <Slider {...settings} ref={slider} className={cx(uiContainer)}>
        {panes.length ? panes.map((pane) => pane.renderItem) : ''}
      </Slider>

      <div className={cx('carousel-menu', theme)}>
        <Menu attached>
          {panes.map((pane, index) => (
            <Menu.Item
              active={activeTabIndex === index}
              onClick={() => {
                if (slider.current && activeTabIndex !== index) {
                  slider.current.slickGoTo(index);
                }
              }}
            >
              {hasScrollIcon &&
              panes.length % 2 > 0 &&
              index + 1 === Math.round(panes.length / 2) ? (
                <Icon
                  className="scroll"
                  name={scrollSVG}
                  size="30px"
                  color="white"
                />
              ) : (
                ''
              )}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </>
  );
};

export default compose(
  connect((state) => {
    return {
      hashlink: state.hashlink,
    };
  }),
  withScrollToTarget,
)(withRouter(View));
