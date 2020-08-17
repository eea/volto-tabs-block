import { SET_TABSBLOCK, REFLOW_BLOCKS_LAYOUT } from './constants';

export function setActiveTab(blockid, selection, mode, currentTabsState) {
  return {
    type: SET_TABSBLOCK,
    blockid,
    selection,
    mode,
    currentTabsState, // This is needed in the reducer
  };
}

export function reflowBlocksLayout(layout) {
  return {
    type: REFLOW_BLOCKS_LAYOUT,
    layout,
  };
}
