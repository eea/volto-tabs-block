export function positionedOffset(targetElement, container) {
  let element = targetElement;
  const document = element.ownerDocument;
  if (!document) {
    return;
  }

  const documentElement = document.documentElement;
  if (!documentElement) {
    return;
  }

  const HTMLElement = document.defaultView.HTMLElement;
  let top = 0;
  let left = 0;
  const height = element.offsetHeight;
  const width = element.offsetWidth;

  while (!(element === document.body || element === container)) {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;

    if (element.offsetParent instanceof HTMLElement) {
      element = element.offsetParent;
    } else {
      return;
    }
  }

  let scrollHeight;
  let scrollWidth;
  let measuredContainer;

  if (
    !container ||
    container === document ||
    container === document.defaultView ||
    container === document.documentElement ||
    container === document.body
  ) {
    measuredContainer = documentElement;
    scrollHeight = getDocumentHeight(document.body, documentElement);
    scrollWidth = getDocumentWidth(document.body, documentElement);
  } else if (container instanceof HTMLElement) {
    measuredContainer = container;
    scrollHeight = container.scrollHeight;
    scrollWidth = container.scrollWidth;
  } else {
    return;
  }

  const bottom = scrollHeight - (top + height);
  const right = scrollWidth - (left + width);
  return { top, left, bottom, right, _container: measuredContainer };
}

export function getDocumentHeight(documentBody, documentElement) {
  return Math.max(
    documentBody.scrollHeight,
    documentElement.scrollHeight,
    documentBody.offsetHeight,
    documentElement.offsetHeight,
    documentElement.clientHeight
  );
}

export function getDocumentWidth(documentBody, documentElement) {
  return Math.max(
    documentBody.scrollWidth,
    documentElement.scrollWidth,
    documentBody.offsetWidth,
    documentElement.offsetWidth,
    documentElement.clientWidth
  );
}
