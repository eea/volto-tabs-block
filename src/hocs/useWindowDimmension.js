import React from 'react';

const getWindowDimension = () => {
  if (typeof window === 'undefined') return {};
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const useWindowDimension = (options = {}) => {
  const { debounceTimeout = 400 } = options;
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimension(),
  );
  const timeoutRef = React.useRef();

  React.useEffect(() => {
    function handleResize() {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(
        () => setWindowDimensions(getWindowDimension()),
        debounceTimeout,
      );
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [debounceTimeout]);

  return windowDimensions;
};

export default useWindowDimension;
