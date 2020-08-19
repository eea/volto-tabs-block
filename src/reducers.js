import { getBlocks, hasBlocksData } from '@plone/volto/helpers';
import defaultContentReducer from '@plone/volto/reducers/content/content';
import {
  CREATE_CONTENT,
  GET_CONTENT,
} from '@plone/volto/constants/ActionTypes';

import { TABSBLOCK, SET_TABSBLOCK } from './constants';
import { tabsLayoutToEmbeddedBlocksLayout } from './Tabs/utils';

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
  isEditView: false,
};

export function content(state = initialContentState, action = {}) {
  const { mode, currentTabsState, blockid, selection } = action;
  switch (action.type) {
    case `${CREATE_CONTENT}_SUCCESS`:
    case `${GET_CONTENT}_SUCCESS`:
      let newState;
      newState = defaultContentReducer(state, action);
      // if (mode !== 'view') return newState;
      if (hasBlocksData(newState.data)) {
        const blocks = getBlocks(newState.data);
        // debugger;
        const _original_items = action.isEditView
          ? newState.data?._original_items ||
            action.result.blocks_layout?.items ||
            []
          : action.result.blocks_layout?.items || [];
        // console.log('original items', _original_items);
        const res =
          blocks.findIndex(([, value]) => value['@type'] === TABSBLOCK) > -1
            ? {
                ...newState,
                data: {
                  ...newState.data,
                  _original_items,
                  blocks_layout: {
                    ...newState.data.blocks_layout,
                    // This will be used by the edit form because we can't
                    // trust items, as it will be mangled
                    // tabsLayoutToEmbeddedBlocksLayout is needed to avoid
                    // duplication of blocks in SSR view
                    items: action.isEditView
                      ? newState.data?._original_items ||
                        newState.data?.blocks_layout?.items
                      : tabsLayoutToEmbeddedBlocksLayout(
                          blocks,
                          currentTabsState,
                        ),
                  },
                },
              }
            : newState;
        console.log(action.type, 'res', res);
        return res;
      }
      return newState;
    case SET_TABSBLOCK:
      // In edit form, No need to tweak the blocks_layout from here
      if (mode === 'edit') return state;

      const blocks = getBlocks(state.data);
      currentTabsState[blockid] = selection;
      return {
        ...state,
        data: {
          ...state.data,
          blocks_layout: {
            ...state.data.blocks_layout,
            items: tabsLayoutToEmbeddedBlocksLayout(blocks, currentTabsState),
          },
        },
      };
    default:
      return defaultContentReducer(state, action);
  }
}
