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
    };
  }
  return {};
};

export { SimpleMarkdown, getMenuPosition };
