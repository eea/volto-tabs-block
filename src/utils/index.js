import SimpleMarkdown from './SimpleMarkdown';

const getMenuPosition = (data) => {
  const positions = {
    top: 'top',
    bottom: 'bottom',
    'left side': 'left',
    'right side': 'right',
  };
  const position = positions[data.menuPosition];
  if (['left', 'right'].includes(position)) {
    return {
      vertical: true,
      direction: position,
    };
  }
  if (['bottom'].includes(position)) {
    return {
      attached: position,
      direction: position,
    };
  }
  return {
    direction: position,
  };
};

const toggleItem = (container, item, hidden) => {
  // Set visibility to hidden, instead of .hidden attribute
  // so we can still calculate distance accurately
  item.style.visibility = hidden ? 'hidden' : '';

  //item.style.display = hidden ? 'none' : 'block';
  // item.style.display = hidden ? 'none' : 'flex';
  // Get tab-item name, if present, so we can match it up with the dropdown menu
  const itemData = item.getAttribute('item-data');

  if (itemData) {
    const itemToHide = container.querySelector(
      `[underline-item-data="${itemData}"]`,
    );
    if (itemToHide instanceof HTMLElement) {
      itemToHide.hidden = !hidden;
    }
  }
};

export { SimpleMarkdown, getMenuPosition, toggleItem };
export * from './dimensions';
