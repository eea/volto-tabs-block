import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { Portal } from 'react-portal';
import loadable from '@loadable/component';
import { RenderBlocks } from '@plone/volto/components';
import {
  waitForNodes,
  withScrollToTarget,
} from '@eeacms/volto-tabs-block/hocs';
import cx from 'classnames';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@eeacms/volto-tabs-block/less/carousel.less';

const Slider = loadable(() => import('react-slick'));

const Dots = waitForNodes((props) => {
  const node = props.node.current;

  return (
    <Portal node={node}>
      <div className="slick-dots-wrapper">
        <ul className={cx('slick-dots', props.uiContainer)}>{props.dots}</ul>
      </div>
    </Portal>
  );
});

const ArrowsGroup = waitForNodes((props) => {
  const { currentSlide, slideCount } = props;
  const node = props.node.current;

  return (
    <Portal node={node}>
      <div
        className={cx({
          'slick-arrows': true,
          'one-arrow': currentSlide === 0 || currentSlide === slideCount - 1,
        })}
      >
        {currentSlide > 0 ? (
          <button
            data-role="none"
            className="slick-arrow slick-prev"
            onClick={props.onPrev}
          >
            Previous
          </button>
        ) : (
          ''
        )}
        {currentSlide < slideCount - 1 ? (
          <button
            data-role="none"
            className="slick-arrow slick-next"
            onClick={props.onNext}
          >
            Next
          </button>
        ) : (
          ''
        )}
      </div>
    </Portal>
  );
});

const View = (props) => {
  const slider = React.useRef(null);
  const [hashlinkOnMount, setHashlinkOnMount] = React.useState(false);
  const {
    metadata = {},
    data = {},
    tabsList = [],
    tabs = {},
    hashlink = {},
  } = props;
  const uiContainer = data.align === 'full' ? 'ui container' : false;

  const onPrev = () => {
    slider.current.slickPrev();
  };

  const onNext = () => {
    slider.current.slickNext();
  };

  const settings = {
    autoplay: false,
    arrows: true,
    dots: true,
    speed: 500,
    initialSlide: 0,
    lazyLoad: 'ondemand',
    prevArrow: <React.Fragment />,
    nextArrow: (
      <ArrowsGroup
        nodes={[props.node, slider]}
        node={props.node}
        slider={slider}
        onPrev={onPrev}
        onNext={onNext}
      />
    ),
    appendDots: (dots) => (
      <Dots
        nodes={[props.node, slider]}
        node={props.node}
        slider={slider}
        dots={dots}
        uiContainer={uiContainer}
      />
    ),
    swipe: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchMove: true,
  };

  React.useEffect(() => {
    const urlHash = props.location.hash.substring(1) || '';
    if (
      hashlink.counter > 0 ||
      (hashlink.counter === 0 && urlHash && !hashlinkOnMount)
    ) {
      const id = hashlink.hash || urlHash || '';
      const index = tabsList.indexOf(id);
      const currentIndex = slider.current?.innerSlider?.state?.currentSlide;
      const parentId = data.id || props.id;
      const parent = document.getElementById(parentId);
      // TODO: Find the best way to add offset relative to header
      //       The header can be static on mobile and relative on > mobile
      // const headerWrapper = document.querySelector('.header-wrapper');
      // const offsetHeight = headerWrapper?.offsetHeight || 0;
      const offsetHeight = 0;
      if (id !== parentId && index > -1 && parent) {
        if (currentIndex !== index) {
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
        <RenderBlocks {...props} metadata={metadata} content={tabs[tab]} />
      ),
    };
  });

  return (
    <>
      <Slider {...settings} ref={slider} className={cx(uiContainer)}>
        {panes.length ? panes.map((pane) => pane.renderItem) : ''}
      </Slider>
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
