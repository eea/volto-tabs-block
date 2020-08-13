import { TABSBLOCK } from './constants';

export function setActiveTab(blockid, selection) {
  return {
    type: TABSBLOCK,
    blockid,
    selection,
  };
}
