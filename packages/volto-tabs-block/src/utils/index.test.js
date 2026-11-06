import { getMenuPosition, toggleItem } from './index';

describe('getMenuPosition', () => {
  it('returns correct position object for top', () => {
    expect(getMenuPosition({ menuPosition: 'top' })).toEqual({
      direction: 'top',
    });
  });

  it('returns correct position object for bottom', () => {
    expect(getMenuPosition({ menuPosition: 'bottom' })).toEqual({
      attached: 'bottom',
      direction: 'bottom',
    });
  });

  it('returns correct position object for left side', () => {
    expect(getMenuPosition({ menuPosition: 'left side' })).toEqual({
      vertical: true,
      direction: 'left',
    });
  });

  it('returns correct position object for right side', () => {
    expect(getMenuPosition({ menuPosition: 'right side' })).toEqual({
      vertical: true,
      direction: 'right',
    });
  });
});

describe('toggleItem', () => {
  it('toggles visibility of item and related item', () => {
    document.body.innerHTML = `<div id="container">
        <div id="item"></div>
        <div id="relatedItem"></div>
      </div>`;
    const container = document.getElementById('container');
    const item = document.getElementById('item');
    const relatedItem = document.getElementById('relatedItem');

    relatedItem.setAttribute('underline-item-data', 'test-data');
    item.setAttribute('item-data', 'test-data');

    item.style.visibility = '';
    relatedItem.hidden = false;

    toggleItem(container, item, true);
    expect(item.style.visibility).toBe('hidden');
  });

  it('handles when no related item is present', () => {
    document.body.innerHTML = `<div id="container">
        <div id="item"></div>
      </div>`;
    const container = document.getElementById('container');
    const item = document.getElementById('item');
    item.setAttribute('item-data', 'test-data');

    item.style.visibility = '';

    toggleItem(container, item, true);
    expect(item.style.visibility).toBe('hidden');

    toggleItem(container, item, false);
    expect(item.style.visibility).toBe('');
  });

  it('handles when no item-data is present', () => {
    document.body.innerHTML = `<div id="container">
        <div id="item"></div>
      </div>`;
    const container = document.getElementById('container');
    const item = document.getElementById('item');

    item.style.visibility = '';

    toggleItem(container, item, true);
    expect(item.style.visibility).toBe('hidden');

    toggleItem(container, item, false);
    expect(item.style.visibility).toBe('');
  });
});
