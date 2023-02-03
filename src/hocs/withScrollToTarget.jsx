import React from 'react';
import { scrollToTarget } from '@eeacms/volto-anchors/helpers';

export default function withScrollToTarget(WrappedComponent) {
  return (props) => {
    const clock = React.useRef(null);
    const time = React.useRef(0);

    const waitScrollToTarget = (target, offset, timeout = 1000) => {
      clock.current = setInterval(() => {
        if (target && document.readyState === 'complete') {
          scrollToTarget(target, offset);
          clearInterval(clock.current);
          time.current = 0;
          return;
        }
        if (time.current >= timeout) {
          clearInterval(clock.current);
          time.current = 0;
          return;
        }
        time.current += 100;
      }, 100);
    };

    React.useEffect(() => {
      return () => {
        clearInterval(clock.current);
        time.current = 0;
      };
    }, []);

    return <WrappedComponent {...props} scrollToTarget={waitScrollToTarget} />;
  };
}
