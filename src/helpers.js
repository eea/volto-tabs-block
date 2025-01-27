import { v4 as uuid } from 'uuid';
import {
  emptyBlocksForm,
  applySchemaDefaults,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  blockHasValue,
} from '@plone/volto/helpers';
import { visitBlocks, toSlug } from '@eeacms/volto-anchors/helpers';

const variationsMapping = {
  carousel: 'carousel-horizontal',
  carousel_vertical: 'carousel-vertical',
};

export const getVariation = (data) => {
  const { variation, template } = data;
  return (
    variationsMapping[variation || template] ||
    variation ||
    template ||
    'default'
  );
};

export const empty = ({ schema, intl }) => {
  const tabId = uuid();
  const data = {
    '@type': 'tab',
    ...emptyBlocksForm(),
  };

  return {
    blocks: {
      [tabId]: applySchemaDefaults({ data, schema, intl }),
    },
    blocks_layout: {
      items: [tabId],
    },
  };
};

export const emptyTab = ({ schema, intl }) => {
  const data = {
    '@type': 'tab',
    ...emptyBlocksForm(),
  };
  return applySchemaDefaults({ data, schema, intl });
};

export const scrollToTarget = (target, offsetHeight = 0) => {
  const bodyRect = document.body.getBoundingClientRect().top;
  const targetRect = target.getBoundingClientRect().top;
  const targetPosition = targetRect - bodyRect - offsetHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });

  return;
};

export const getParentTabFromHash = (tabsBlockData, urlHash) => {
  if (urlHash) {
    const { data } = tabsBlockData;
    let parentBlockId;
    let isSlugPresent;
    visitBlocks(data, ([id, data]) => {
      if (data['@type'] === 'tab') parentBlockId = id;
      if (toSlug(data.plaintext) === urlHash) {
        isSlugPresent = true;
        return true;
      }
    });
    return isSlugPresent ? parentBlockId : null;
  }
  return null;
};

export const isTabEmpty = (content) => {
  const blocks_field = getBlocksFieldname(content);
  const blocks_layout_field = getBlocksLayoutFieldname(content);
  const blocks = content[blocks_field] || {};
  const blocksLayout = content[blocks_layout_field]?.items || [];

  return blocksLayout.every((blockId) => {
    const block = blocks[blockId];
    return !blockHasValue(block);
  });
};
