import {
  sliceBlocksByTabs,
  deriveTabsFromState,
  expandTabsLayoutToBlocksLayout,
} from './utils';

describe('sliceBlocksByTabs', () => {
  it('returns empty list when empty', () => {
    expect(sliceBlocksByTabs([])).toStrictEqual([]);
  });

  it('returns all blocks when no tabs block', () => {
    const blocks = [
      ['a', {}],
      ['b', {}],
    ];
    expect(sliceBlocksByTabs(blocks)).toStrictEqual(blocks);
  });

  it('returns all blocks after a tabs block', () => {
    const blocks = [
      ['a', {}],
      ['b', {}],
      ['c', { '@type': 'tabsBlock' }],
      ['d', {}],
      ['e', {}],
    ];
    expect(sliceBlocksByTabs(blocks)).toStrictEqual([
      ['d', {}],
      ['e', {}],
    ]);
  });

  it('returns all blocks between tabs block', () => {
    const blocks = [
      ['a', {}],
      ['b', {}],
      ['c', { '@type': 'tabsBlock' }],
      ['d', {}],
      ['e', {}],
      ['f', { '@type': 'tabsBlock' }],
      ['g', {}],
      ['h', {}],
    ];
    expect(sliceBlocksByTabs(blocks)).toStrictEqual([
      ['d', {}],
      ['e', {}],
    ]);
  });

  it('returns empty blocks when afterBlock is not found', () => {
    const blocks = [
      ['a', {}],
      ['b', {}],
    ];
    expect(sliceBlocksByTabs(blocks, 'x')).toStrictEqual([]);
  });

  it('returns empty blocks when afterBlock is not block type', () => {
    const blocks = [
      ['a', {}],
      ['b', {}],
    ];
    expect(sliceBlocksByTabs(blocks, 'a')).toStrictEqual([]);
  });

  it('returns blocks between tabs block', () => {
    const blocks = [
      ['a', {}],
      ['b', {}],
      ['c', { '@type': 'tabsBlock' }],
      ['d', {}],
      ['e', {}],
      ['f', { '@type': 'tabsBlock' }],
      ['g', {}],
      ['h', {}],
    ];
    expect(sliceBlocksByTabs(blocks)).toStrictEqual([
      ['d', {}],
      ['e', {}],
    ]);
  });

  it('returns blocks after tabs block', () => {
    const blocks = [
      ['a', {}],
      ['b', {}],
      ['c', { '@type': 'tabsBlock' }],
      ['d', {}],
      ['e', {}],
      ['f', { '@type': 'tabsBlock' }],
      ['g', {}],
      ['h', {}],
    ];
    expect(sliceBlocksByTabs(blocks, 'c')).toStrictEqual([
      ['g', {}],
      ['h', {}],
    ]);
  });

  it('returns empty blocks when no any after tabs block', () => {
    const blocks = [
      ['a', {}],
      ['b', {}],
      ['c', { '@type': 'tabsBlock' }],
      ['d', {}],
      ['e', {}],
      ['f', { '@type': 'tabsBlock' }],
      ['g', {}],
      ['h', {}],
    ];
    expect(sliceBlocksByTabs(blocks, 'f')).toStrictEqual([]);
  });
});

describe('expandTabsLayoutToBlocksLayout', () => {
  it('returns flat list from nothing', () => {
    expect(expandTabsLayoutToBlocksLayout()).toStrictEqual([]);
  });
  it('returns flat list from empty list', () => {
    expect(expandTabsLayoutToBlocksLayout([])).toStrictEqual([]);
  });
  it('returns flat list from one tab', () => {
    const tabsLayout = [['a']];
    expect(expandTabsLayoutToBlocksLayout(tabsLayout)).toStrictEqual(['a']);
  });
  it('returns flat list from one tab, multiple blocks', () => {
    const tabsLayout = [['a', 'b', 'c']];
    expect(expandTabsLayoutToBlocksLayout(tabsLayout)).toStrictEqual([
      'a',
      'b',
      'c',
    ]);
  });
  it('returns flat list from one tab, multiple blocks', () => {
    const tabsLayout = [
      ['a', 'b', 'c'],
      ['d', 'e', 'f'],
    ];
    expect(expandTabsLayoutToBlocksLayout(tabsLayout)).toStrictEqual([
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
    ]);
  });
});

describe('deriveTabsFromState', () => {
  // add a new block
  // move a block
  // delete a block
  // move a block out of tabs
  // move a block in tabs
  // move a block between tabs??

  const availableTabs = [
    { title: 'First' },
    { title: 'Second' },
    { title: 'Third' },
  ];

  // return 2 things: new blocks_layout and the tabs structure
  it('doesnt change tabs when not needed', () => {
    const tabsLayout = [];
    const blocks = [
      ['a', { '@type': 'title' }],
      ['b', { '@type': 'tabsBlock' }],
      ['c', { '@type': 'text' }],
    ];
    const activeTab = 0;
    const res = deriveTabsFromState({
      tabsLayout,
      blocks,
      availableTabs,
      activeTab,
    });
    expect(res[0]).toStrictEqual([]);
    expect(res[1]).toStrictEqual([]);
  });
});
