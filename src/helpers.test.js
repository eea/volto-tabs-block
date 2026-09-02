import {
  empty,
  emptyTab,
  scrollToTarget,
  getParentTabFromHash,
  isTabEmpty,
} from './helpers';
// import { emptyBlocksForm } from '@plone/volto/helpers';
import { visitBlocks, toSlug } from '@eeacms/volto-anchors/helpers';

// vi.mock('@plone/volto/helpers', () => ({
//   emptyBlocksForm: vi.fn(),
// }));

vi.mock('@eeacms/volto-anchors/helpers', () => ({
  visitBlocks: vi.fn(),
  toSlug: vi.fn(),
}));

const schema = {
  fieldsets: [{ id: 'default', fields: [] }],
  properties: {},
  required: [],
};

describe('empty function', () => {
  it('returns a tab block with unique ID', () => {
    // emptyBlocksForm.mockReturnValue({});
    const result = empty({ schema });
    expect(Object.keys(result.blocks)).toHaveLength(1);
    expect(result.blocks[Object.keys(result.blocks)[0]]['@type']).toEqual(
      'tab',
    );
    expect(result.blocks_layout.items).toEqual([Object.keys(result.blocks)[0]]);
  });
});

describe('emptyTab function', () => {
  it('returns a tab block', () => {
    // emptyBlocksForm.mockReturnValue({});
    const result = emptyTab({ schema });
    expect(result['@type']).toEqual('tab');
  });
});

describe('isTabEmpty function', () => {
  it('returns if a tab is empty', () => {
    // emptyBlocksForm.mockReturnValue({});
    const result = isTabEmpty({
      blocks: {},
      blocks_layout: {
        items: [],
      },
    });
    expect(result).toEqual(true);
  });
});

describe('scrollToTarget', () => {
  it('should call window.scrollTo with the correct arguments', () => {
    window.scrollTo = vi.fn();

    const mockElement = {
      getBoundingClientRect: vi.fn(),
    };

    document.body.getBoundingClientRect = vi.fn(() => ({ top: 100 }));
    mockElement.getBoundingClientRect.mockReturnValue({ top: 200 });

    scrollToTarget(mockElement, 50);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 50,
      behavior: 'smooth',
    });
  });

  it('should call window.scrollTo with the correct arguments with offsetHeight not provided', () => {
    window.scrollTo = vi.fn();

    const mockElement = {
      getBoundingClientRect: vi.fn(),
    };

    document.body.getBoundingClientRect = vi.fn(() => ({ top: 100 }));
    mockElement.getBoundingClientRect.mockReturnValue({ top: 200 });

    scrollToTarget(mockElement);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 100,
      behavior: 'smooth',
    });
  });
});

describe('getParentTabFromHash function', () => {
  beforeEach(() => {
    visitBlocks.mockClear();
    toSlug.mockClear();
  });

  it('returns parentBlockId if slug is not matching urlHash', () => {
    const urlHash = 'slug';
    const tabsBlockData = { data: 'test' };
    const parentBlockId = 'parentBlockId';
    const dataForCallback = { '@type': 'tab', plaintext: urlHash };

    visitBlocks.mockImplementation((data, callback) => {
      callback([parentBlockId, dataForCallback]);
    });
    toSlug.mockReturnValue(urlHash);

    const result = getParentTabFromHash(tabsBlockData, urlHash);
    expect(result).toEqual(parentBlockId);
  });

  it('returns null if slug is matching urlHash', () => {
    const urlHash = 'slug';
    const tabsBlockData = { data: 'test' };
    const parentBlockId = 'parentBlockId';
    const dataForCallback = { '@type': 'tab', plaintext: 'notMatchingSlug' };

    visitBlocks.mockImplementation((data, callback) => {
      callback([parentBlockId, dataForCallback]);
    });
    toSlug.mockReturnValue('notMatchingSlug');

    const result = getParentTabFromHash(tabsBlockData, urlHash);
    expect(result).toEqual(null);
  });

  it('returns null if urlHash is not provided', () => {
    const tabsBlockData = { data: 'test' };
    const result = getParentTabFromHash(tabsBlockData, null);
    expect(result).toEqual(null);
  });
});
