import React from 'react';
import { useWindowDimmension } from '@eeacms/volto-tabs-block/hocs';

export default function useResponsiveTabs({
  responsive = false,
  tabsRef,
  tabsList,
}) {
  const { width } = useWindowDimmension();
  const maxCount = tabsList.length;
  const [visibleCount, setVisibleCount] = React.useState(maxCount);

  React.useEffect(() => {
    if (responsive !== 'collapseMenu') return;
    function handleResize() {
      setVisibleCount(maxCount);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [maxCount, responsive]);

  React.useLayoutEffect(() => {
    if (responsive !== 'collapseMenu') return;
    // compute the number of tabs that are hidden due to overflow
    const tabsMenuNode = tabsRef.current.children[0];
    if (tabsMenuNode.scrollWidth === tabsMenuNode.clientWidth) return;
    const rightSide = tabsMenuNode.getBoundingClientRect().right;
    const children = Array.from(tabsMenuNode.children || []);
    const inViewCount = children.reduce(
      (acc, node) =>
        node.getBoundingClientRect().right > rightSide ? acc : acc + 1,
      -1,
    );
    let ref = setTimeout(() => setVisibleCount(inViewCount), 100);
    return () => clearTimeout(ref);
  }, [width, responsive, tabsRef]);

  return visibleCount;
}
