import { TABSBLOCK } from 'volto-tabsblock/constants';
import { getBlocks } from '@plone/volto/helpers';

function isEqual(arr1, arr2) {
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
export function sliceBlocksByTabs(blocks, afterBlock) {
  const afterBlockIndex = blocks.findIndex(([id]) => id === afterBlock);
  const firstTabsBlockIndex = blocks.findIndex(
    ([id, block], index) => block['@type'] === TABSBLOCK,
  );

  const afterAfterBlockIndex = blocks.findIndex(
    ([id, block], index) =>
      block['@type'] === TABSBLOCK && index > afterBlockIndex,
  );

  const start = afterBlock
    ? afterAfterBlockIndex > -1
      ? afterAfterBlockIndex + 1
      : blocks.length
    : firstTabsBlockIndex > -1
    ? firstTabsBlockIndex + 1
    : 0;

  let end = blocks.findIndex(
    ([id, block], index) => block['@type'] === TABSBLOCK && index > start,
  );
  end = end !== -1 ? end : blocks.length;

  // console.log(start, end);
  return blocks.slice(start, end);
}

/**
 * Expands a tab layout to blocksLayout
 * Useful for example when deleting a tabs block
 */
export function expandTabsLayoutToBlocksLayout(tabsLayout) {
  return (tabsLayout || []).flat(1);
}

/**
 * Derives the tab structure to be store, based on existing information and new
 * operations in form
 *
 * We're dealing with continuous ranges of ids that have windows of them
 * We want to manipulate the blocks_layout.items to fake the tabs
 * We're trying to accomodate normal operations like "add tab", "delete block"
 * But also operatoins such as "change tab"
 *
 * For the moment we'll support only one tabs block per page, to avoid odd edge
 * cases.
 *
 * Available operations:
 *
 * - a new TabsBlock is dropped in the form.
 *   - nothing special happens
 * - A new tab is created in a Tab Block
 *   - nothing special happens
 * - A new block is inserted
 *   - The block is added in the tabsLayout structure of the TabsBlock
 * - A block is deleted
 *   - The block is identified and removed from the tabsLayout of its TabsBlock
 * - A block is moved inside the tab
 *   - No changes needed to blocks_layout. Sync tabsLayout to blocks_layout
 * - A block is moved out of tab
 *   - tabs_layout updated, blocks_layout updated
 * - The active tab is switched
 *   - the blocks_layout.items is changed
 *
 */
export function deriveTabsFromState({
  tabsLayout,
  blocks,
  // availableTabs,
  activeTab,
  currentBlock,
}) {
  //
  const blockIds = blocks.map(([id]) => id);
  // all available blocks in blocks_layout.items
  const afterBlocksIds = blockIds.slice(blockIds.indexOf(currentBlock) + 1);
  const tabsLayoutBlockIds = tabsLayout.flat(1);

  if (tabsLayoutBlockIds !== afterBlocksIds) {
    const added = afterBlocksIds
      .map((b) => !tabsLayoutBlockIds.includes(b) && b)
      .filter((b) => b);
    // console.log('added', added);

    const removed = tabsLayoutBlockIds
      .map((b) => !afterBlocksIds.includes(b) && b)
      .filter((b) => b);

    if (added.length) {
      // We assume continuos range of blocks
      // get the previous block in current tab. If this tab doesn't exist,
      // insert at position 0
      const prevTab = afterBlocksIds.indexOf(added[0][0]);
      const upto = Math.max(afterBlocksIds.indexOf(prevTab), 0);
      const currentPageTabs = (tabsLayout[activeTab] || [])
        .slice(0, upto)
        .concat(added);
      tabsLayout[activeTab] = currentPageTabs;
      return [tabsLayout];
    }

    if (removed.length) {
      // console.log('removed', removed);
    }
  }
}

/**
 * tabsLayoutToBlocksLayout.
 *
 * @param {Object} formData
 */
export function tabsLayoutToBlocksLayout(formData, tabsState) {
  const blocks = getBlocks(formData);
  let blocks_layout = [];
  let foundTabsBlock = false;

  blocks.forEach(([id, blockData]) => {
    if (!foundTabsBlock) {
      blocks_layout.push(id);
    }
    const type = blockData['@type'];
    if (type === TABSBLOCK) {
      const activeTab = tabsState[id] || 0;
      // console.log('activeTab', activeTab, blockData);
      const tabs = blockData.tabsLayout?.[activeTab] || [];
      // console.log('tabs', tabs);
      blocks_layout = blocks_layout.concat(tabs);
      foundTabsBlock = true;
    }
  });

  return blocks_layout;
}

export function globalDeriveTabsFromState({ blocks, tabsState }) {
  // Derives the new tabsLayout state from the current snapshot of the state
  // We presume there has been a new Volto Form.jsx operation
  // A new block (or more) has been inserted in the formData
  // A block (or more) have been removed from the formData
  //
  // Returns a mapping of <TabsBlock id> : tabsLayout
  // This allows updating all the tabs
  //
  // In principle we can assume that operations happen in a single tabs block
  // (or before one) and changed tabs are continuous

  // This is not real blocks data, it has been already tweaked.
  // We want to understand what blocks have been added and what blocks have
  // been removed;
  // const blocks_layout = formData.blocks_layout.items;
  const result = {};
  // let foundTabsBlock = false;
  const blockIds = blocks.map(([id]) => id);

  // console.log('blocks', blocks);
  blocks.forEach(([blockId, blockData]) => {
    const type = blockData['@type'];
    if (type === TABSBLOCK) {
      // TODO: get them to the next Tabs Block
      const afterBlocksIds = blockIds.slice(blockIds.indexOf(blockId) + 1);
      const activeTab = tabsState[blockId] || 0;
      // console.log('activetab', activeTab);

      // console.log('activeTab', activeTab, blockData);
      const { tabsLayout } = blockData;
      const tabs = tabsLayout[activeTab] || [];

      if (!isEqual(afterBlocksIds, tabs)) {
        tabsLayout[activeTab] = afterBlocksIds;
      }

      result[blockId] = tabsLayout;
    }
  });

  return result;
}

// console.log('prevTab', prevTab);
// console.log('upto', upto);
// console.log('new tabs', tabsLayout, currentPageTabs);
// console.log('afterBlockIds', afterBlocksIds);
//
// // all available blocks in blocks_layout.items
// const tabsLayoutBlockIds = tabsLayout.flat(1);
//
// if (tabsLayoutBlockIds !== afterBlocksIds) {
//   const added = afterBlocksIds
//     .map((b) => !tabsLayoutBlockIds.includes(b) && b)
//     .filter((b) => b);
//   console.log('added', added);
//
//   const removed = tabsLayoutBlockIds
//     .map((b) => !afterBlocksIds.includes(b) && b)
//     .filter((b) => b);
//
//   if (added.length) {
//     // We assume continuos range of blocks
//     // get the previous block in current tab. If this tab doesn't exist,
//     // insert at position 0
//     const prevTab = afterBlocksIds.indexOf(added[0][0]);
//     const upto = Math.max(afterBlocksIds.indexOf(prevTab), 0);
//     const currentPageTabs = (tabsLayout[activeTab] || [])
//       .slice(0, upto)
//       .concat(added);
//     tabsLayout[activeTab] = currentPageTabs;
//     return [tabsLayout];
//   }
//
//   if (removed.length) {
//     console.log('removed', removed);
//   }
// }
// console.log('tabs', tabs);
//
// const added = afterBlocksIds
//   .map((b) => !tabs.includes(b) && b)
//   .filter((b) => b);
//
// const removed = tabs
//   .map((b) => !afterBlocksIds.includes(b) && b)
//   .filter((b) => b);
//
// console.log('added', added);
// console.log('removed', removed);
// // console.log('tabs', tabs);
// // blocks_layout = blocks_layout.concat(tabs);
// foundTabsBlock = true;
// formData,
// blocks_layout,
// blocks_layout,
// tabsLayout,
// availableTabs,
// activeTab,
// currentBlock,
