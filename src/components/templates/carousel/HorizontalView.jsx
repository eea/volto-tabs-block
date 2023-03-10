import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import loadable from '@loadable/component';
import cx from 'classnames';
import { Icon, RenderBlocks } from '@plone/volto/components';
import { withScrollToTarget } from '@eeacms/volto-tabs-block/hocs';

import rightArrowSVG from '@eeacms/volto-tabs-block/icons/right-arrow.svg';
import leftArrowSVG from '@eeacms/volto-tabs-block/icons/left-arrow.svg';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@eeacms/volto-tabs-block/less/carousel.less';

const Slider = loadable(() => import('react-slick'));

const Dots = (props) => {
  const { activeTab = null, tabsList = [], slider = {} } = props;
  return tabsList.length > 1 ? (
    <div className="slick-dots-wrapper">
      <div className="slick-line" />
      <ul className={cx('slick-dots ui container', props.uiContainer)}>
        {tabsList.map((tab, index) => (
          <li
            key={`dot-${tab}`}
            className={cx({ 'slick-active': activeTab === tab })}
          >
            <button
              aria-label={`Select slide ${index + 1}`}
              tabIndex={0}
              onClick={() => {
                if (slider.current) {
                  slider.current.slickGoTo(index);
                }
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  ) : (
    ''
  );
};

const ArrowsGroup = (props) => {
  const { activeTab = null, tabsList = [], slider = {} } = props;
  const currentSlide = tabsList.indexOf(activeTab);
  const slideCount = tabsList.length;

  return (
    <div
      className={cx({
        'slick-arrows': true,
        'one-arrow': currentSlide === 0 || currentSlide === slideCount - 1,
      })}
    >
      {currentSlide > 0 ? (
        <button
          aria-label="Previous slide"
          className="slick-arrow slick-prev"
          onClick={() => {
            if (slider.current) {
              slider.current.slickPrev();
            }
          }}
          tabIndex={0}
        >
          <Icon name={leftArrowSVG} size="50px" />
        </button>
      ) : (
        ''
      )}
      {currentSlide < slideCount - 1 ? (
        <button
          aria-label="Next slide"
          className="slick-arrow slick-next"
          onClick={() => {
            if (slider.current) {
              slider.current.slickNext();
            }
          }}
          tabIndex={0}
        >
          <Icon name={rightArrowSVG} size="50px" />
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

const View = (props) => {
  const slider = React.useRef(null);
  const [hashlinkOnMount, setHashlinkOnMount] = React.useState(false);
  const blockId = props.id;
  const {
    activeTab = null,
    data = {},
    hashlink = {},
    metadata = {},
    tabsList = [],
    tabs = {},
    setActiveTab = () => {},
  } = props;
  const activeTabIndex = tabsList.indexOf(activeTab);
  const uiContainer = data.align === 'full' ? 'ui container' : false;

  const settings = {
    autoplay: false,
    arrows: false,
    dots: false,
    speed: 500,
    initialSlide: 0,
    lazyLoad: 'ondemand',
    swipe: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchMove: true,
    beforeChange: (oldIndex, index) => {
      setActiveTab(tabsList[index]);
    },
  };

  React.useEffect(() => {
    if (!slider.current?.innerSlider?.list) return;
    const unfocuseElements = ['a', 'button', 'input'];
    unfocuseElements.forEach((tag) => {
      for (let element of slider.current.innerSlider.list.querySelectorAll(
        ".slick-slide[aria-hidden='true'] a",
      )) {
        element.setAttribute('aria-hidden', 'false');
      }
    });
  }, [activeTab]);
  React.useEffect(() => {
    if (!slider.current?.innerSlider?.list) return;
    let unaccesibileElements = slider.current.innerSlider.list.querySelectorAll(
      '.slick-slide',
    );
    for (let element of unaccesibileElements) {
      element.setAttribute('tabindex', '0');
      element.setAttribute('aria-hidden', 'false');
      element.style.removeProperty('outline');
    }
    if (document.getElementsByClassName('slick-slider')?.length > 0)
      for (let carouselDiv of document.getElementsByClassName('slick-slider'))
        carouselDiv.setAttribute('tabindex', '0');
  }, []);

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
      // TODO: Find the best way to add offset relative to header
      //       The header can be static on mobile and relative on > mobile
      const headerWrapper = document.querySelector('.header-wrapper');
      const offsetHeight = headerWrapper?.offsetHeight || 0;
      if (
        id !== parentId &&
        parentId === hashlink.data.parentId &&
        index > -1 &&
        parent
      ) {
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
        <RenderBlocks
          key={`slide-${tab}`}
          {...props}
          metadata={metadata}
          content={tabs[tab]}
        />
      ),
    };
  });

  return (
    <>
      <Slider
        {...settings}
        ref={slider}
        className={cx(uiContainer, 'tabs-accessibility')}
        accessibility={true}
        afterChange={() => {
          if (
            document
              .getElementById(blockId)
              ?.getElementsByClassName('slick-slider')?.length > 0
          ) {
            document
              .getElementById(blockId)
              .getElementsByClassName('slick-current')[0]
              .focus();
          }
        }}
      >
        {panes.length ? panes.map((pane) => pane.renderItem) : ''}
      </Slider>
      <ArrowsGroup activeTab={activeTab} tabsList={tabsList} slider={slider} />
      <Dots activeTab={activeTab} tabsList={tabsList} slider={slider} />
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
