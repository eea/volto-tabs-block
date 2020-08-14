import { SET_TABSBLOCK } from './constants';

const initialState = {};

export function tabs_block(state = initialState, action = {}) {
  switch (action.type) {
    case SET_TABSBLOCK:
      return {
        ...state,
        [action.blockid]: action.selection,
      };
    default:
      return state;
  }
}
