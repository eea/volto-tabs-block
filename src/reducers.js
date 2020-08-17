// import { omit, map, mapKeys } from 'lodash';
import { getBlocks, hasBlocksData } from '@plone/volto/helpers';
import defaultContentReducer from '@plone/volto/reducers/content/content';
import {
  CREATE_CONTENT,
  GET_CONTENT,
} from '@plone/volto/constants/ActionTypes';

import { TABSBLOCK, SET_TABSBLOCK, REFLOW_BLOCKS_LAYOUT } from './constants';
import { tabsLayoutToEmbeddedBlocksLayout } from './Tabs/utils';
// import { settings } from '~/config';

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

// function getRequestKey(actionType) {
//   return actionType.split('_')[0].toLowerCase();
// }

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
  const { mode, currentTabsState, blockid, selection } = action;
  switch (action.type) {
    case `${CREATE_CONTENT}_SUCCESS`:
    case `${GET_CONTENT}_SUCCESS`:
      const newState = defaultContentReducer(state, action);
      // if (mode !== 'view') return newState;
      if (hasBlocksData(newState.data)) {
        const blocks = getBlocks(newState.data);
        const res =
          blocks.findIndex(([, value]) => value['@type'] === TABSBLOCK) > -1
            ? {
                ...newState,
                data: {
                  ...newState.data,
                  blocks_layout: {
                    ...newState.data.blocks_layout,
                    // This will be used by the edit form because we can't
                    // trust items, as it will be mangled
                    original_items: [
                      ...(newState.data?.blocks_layout?.items || []),
                    ],
                    // This is needed to avoid duplication of blocks in SSR
                    items: tabsLayoutToEmbeddedBlocksLayout(
                      blocks,
                      currentTabsState,
                    ),
                  },
                },
              }
            : newState;
        return res;
      }
      return newState;
    case REFLOW_BLOCKS_LAYOUT:
      return {
        ...state,
        data: {
          ...state.data,
          blocks_layout: {
            ...state.data.blocks_layout,
            items: action.layout,
          },
        },
      };
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
