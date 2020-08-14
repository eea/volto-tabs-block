import { SET_TABSBLOCK } from './constants';

export function setActiveTab(blockid, selection) {
  return {
    type: SET_TABSBLOCK,
    blockid,
    selection,
  };
}
