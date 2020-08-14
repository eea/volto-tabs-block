import { SET_TABSBLOCK } from './constants';
import { getBlocks } from '@plone/volto/helpers';
import { tabsLayoutToBlocksLayout } from './Tabs/utils';
import defaultContentReducer from '@plone/volto/reducers/content/content';

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

const initialContentState = {
  create: {
    loaded: false,
    loading: false,
    error: null,
  },
  delete: {
    loaded: false,
    loading: false,
    error: null,
  },
  update: {
    loaded: false,
    loading: false,
    error: null,
  },
  get: {
    loaded: false,
    loading: false,
    error: null,
  },
  order: {
    loaded: false,
    loading: false,
    error: null,
  },
  data: null,
  subrequests: {},
};

export function content(state = initialContentState, action = {}) {
  switch (action.type) {
    case SET_TABSBLOCK:
      const { mode, currentTabsState, blockid, selection } = action;
      if (mode !== 'view') return state;
      const blocks = getBlocks(state.data);
      currentTabsState[blockid] = selection;
      return {
        ...state,
        data: {
          ...state.data,
          blocks_layout: {
            ...state.data.blocks_layout,
            items: tabsLayoutToBlocksLayout(blocks, currentTabsState),
          },
        },
      };
    default:
      return defaultContentReducer(state, action);
  }
}
