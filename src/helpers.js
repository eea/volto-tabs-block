import { v4 as uuid } from 'uuid';
import { emptyBlocksForm } from '@plone/volto/helpers';

export const empty = () => {
  const tabId = uuid();

  return {
    blocks: {
      [tabId]: {
        '@type': 'tab',
        ...emptyBlocksForm(),
      },
    },
    blocks_layout: {
      items: [tabId],
    },
  };
};

export const emptyTab = () => ({
  '@type': 'tab',
  ...emptyBlocksForm(),
});

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
