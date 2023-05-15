import React from 'react';
import { defineMessages } from 'react-intl';
import { withRouter } from 'react-router';
import loadable from '@loadable/component';
import cx from 'classnames';
import { Icon, RenderBlocks } from '@plone/volto/components';

import rightArrowSVG from '@eeacms/volto-tabs-block/icons/right-arrow.svg';
import leftArrowSVG from '@eeacms/volto-tabs-block/icons/left-arrow.svg';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@eeacms/volto-tabs-block/less/carousel.less';

import noop from 'lodash/noop';

const messages = defineMessages({
  SelectSlide: {
    id: 'select-slide',
    defaultMessage: 'Select slide {index}',
  },
  PreviousSlide: {
    id: 'previous-slide',
    defaultMessage: 'Previous slide',
  },
  NextSlide: {
    id: 'next-slide',
    defaultMessage: 'Next slide',
  },
});

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
              aria-label={intl.formatMessage(messages.SelectSlide, { index: `${index + 1}` })}
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
          aria-label={intl.formatMessage(messages.PreviousSlide)}
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
          aria-label={intl.formatMessage(messages.NextSlide)}
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
  const blockId = props.id;
  const {
    activeTab = null,
    data = {},
    metadata = {},
    tabsList = [],
    tabs = {},
    setActiveTab = noop,
  } = props;
  const uiContainer = data.align === 'full' ? 'ui container' : false;

  const settings = {
    autoplay: false,
    arrows: false,
    dots: false,
    speed: 500,
    initialSlide: 0,
    swipe: true,
    slidesToShow: 1,
    lazyLoad: false,
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

export default withRouter(View);
