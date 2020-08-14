import { SET_TABSBLOCK } from './constants';

export function setActiveTab(blockid, selection, mode, currentTabsState) {
  return {
    type: SET_TABSBLOCK,
    blockid,
    selection,
    mode,
    currentTabsState,
  };
}
