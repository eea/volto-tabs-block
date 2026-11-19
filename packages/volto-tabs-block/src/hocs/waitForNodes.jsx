import React from 'react';

const TIMEOUT = 2000;

export default function waitForNodes(WrappedComponent) {
  return (props) => {
    const [readyToRender, setReadyToRender] = React.useState(false);
    const clock = React.useRef(null);
    const time = React.useRef(0);
    const nodes = React.useRef(props.nodes);

    React.useEffect(() => {
      nodes.current = props.nodes;
      /* eslint-disable-next-line */
    }, [props.nodes]);

    React.useEffect(() => {
      clock.current = setInterval(() => {
        if (nodes.current.filter((node) => !node.current).length === 0) {
          setReadyToRender(true);
          clearInterval(clock.current);
          time.current = 0;
          return;
        }
        if (time.current >= TIMEOUT) {
          clearInterval(clock.current);
          time.current = 0;
          return;
        }
        time.current += 100;
      }, 100);
      return () => {
        clearInterval(clock.current);
        time.current = 0;
      };
      /* eslint-disable-next-line */
    }, []);

    if (!readyToRender) return '';
    return <WrappedComponent {...props} readyToRender={readyToRender} />;
  };
}
