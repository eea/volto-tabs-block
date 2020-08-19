import { SET_TABSBLOCK } from './constants';

export function setActiveTab(blockid, selection, mode, currentTabsState) {
  return {
    type: SET_TABSBLOCK,
    blockid,
    selection,
    mode,
    currentTabsState, // This is needed in the reducer
  };
}

export function resetContentForEdit(isEditView, content) {
  return {
    type: 'GET_CONTENT_SUCCESS',
    isEditView,
    result: content,
  };
}
