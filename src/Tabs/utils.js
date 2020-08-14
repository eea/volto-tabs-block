import { TABSBLOCK } from 'volto-tabsblock/constants';

export function isEqual(arr1, arr2) {
  return (
    arr1.length === arr2.length &&
    arr1.every(function (value, index) {
      return value === arr2[index];
    })
  );
}

/**
 * Returns a slice of blocks between two TabsBlocks
 *
 * @param {String} afterBlock Slice starts after Block id. Optional
 * @param {Array} blocks A list of pairs of blockId, blockData
 */
export function sliceBlocksByTabs(blocks, startTabsBlock) {
  const start = blocks.findIndex(([id]) => id === startTabsBlock);
  const nextTabsBlockIndex = blocks.findIndex(
    ([id, block], index) => block['@type'] === TABSBLOCK && index > start,
  );
  const end = nextTabsBlockIndex > -1 ? nextTabsBlockIndex : blocks.length;
  return blocks.slice(start + 1, end);
}

/**
 * tabsLayoutToBlocksLayout.
 *
 * @param {Object} formData
 */
export function tabsLayoutToBlocksLayout(blocks, tabsState) {
  let blocks_layout = [];
  let foundTabsBlock = false;

  blocks.forEach(([id, blockData]) => {
    if (!foundTabsBlock) blocks_layout.push(id);

    const type = blockData['@type'];

    if (type === TABSBLOCK) {
      if (foundTabsBlock) blocks_layout.push(id);
      const activeTab = tabsState[id] || 0;
      const tabs = blockData.tabsLayout?.[activeTab] || [];
      blocks_layout = blocks_layout.concat(tabs);
      foundTabsBlock = true;
    }
  });

  return blocks_layout;
}

/**
 * globalDeriveTabsFromState.
 *
  Derives the new tabsLayout state from the current snapshot of the state
  We presume there has been a new Volto Form.jsx operation
  A new block (or more) has been inserted in the formData
  A block (or more) have been removed from the formData

  Returns a mapping of <TabsBlock id> : tabsLayout
  This allows updating all the tabs

  In principle we can assume that operations happen in a single tabs block
  (or before one) and changed tabs are continuous

  This is not real blocks data, it has been already tweaked.
  We want to understand what blocks have been added and what blocks have
  been removed;
 *
 * @param {}
 */
export function globalDeriveTabsFromState({ blocks, tabsState }) {
  const result = {};

  blocks.forEach(([blockId, blockData]) => {
    const type = blockData['@type'];
    if (type === TABSBLOCK) {
      // TODO: get them to the next Tabs Block
      // const afterBlocksIds = blockIds.slice(blockIds.indexOf(blockId) + 1);
      const afterBlocksIds = sliceBlocksByTabs(blocks, blockId).map(
        ([id]) => id,
      );
      console.log('slice', afterBlocksIds);
      const activeTab = tabsState[blockId] || 0;

      const { tabsLayout = [] } = blockData;
      const tabs = tabsLayout[activeTab] || [];

      if (!isEqual(afterBlocksIds, tabs)) {
        // Update the blocks for this tab and TabsBlock.
        tabsLayout[activeTab] = afterBlocksIds;
      }

      result[blockId] = tabsLayout;
    }
  });

  return result;
}
