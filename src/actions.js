import { SET_TABSBLOCK, RESET_ALL_TABSBLOCK } from './constants';

export function setActiveTab(blockid, selection, mode, currentTabsState, path) {
  return {
    type: SET_TABSBLOCK,
    blockid,
    selection,
    mode,
    currentTabsState, // This is needed in the reducer
    path,
  };
}

export function resetTabs() {
  return {
    type: RESET_ALL_TABSBLOCK,
  };
}

export function resetContentForEdit(isEditView, content) {
  return {
    type: 'GET_CONTENT_SUCCESS',
    isEditView,
    result: content,
  };
}
