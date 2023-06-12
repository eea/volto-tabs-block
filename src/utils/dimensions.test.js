import {
  positionedOffset,
  getDocumentHeight,
  getDocumentWidth,
} from './dimensions';

describe('positionedOffset', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="container">
        <div id="element" style="height: 50px; width: 50px;"></div>
      </div>`;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns correct offset position', () => {
    const element = document.querySelector('#element');
    const container = document.querySelector('#container');

    jest.spyOn(element, 'offsetTop', 'get').mockReturnValue(100);
    jest.spyOn(element, 'offsetLeft', 'get').mockReturnValue(200);
    jest.spyOn(element, 'offsetHeight', 'get').mockReturnValue(50);
    jest.spyOn(element, 'offsetWidth', 'get').mockReturnValue(50);
    jest.spyOn(element, 'offsetParent', 'get').mockReturnValue(container);

    jest.spyOn(container, 'scrollHeight', 'get').mockReturnValue(500);
    jest.spyOn(container, 'scrollWidth', 'get').mockReturnValue(500);

    const result = positionedOffset(element, container);

    expect(result).toEqual({
      top: 100,
      left: 200,
      bottom: 350,
      right: 250,
      _container: container,
    });
  });

  it('returns correct offset position when container is undefined', () => {
    document.body.innerHTML = `
      <div id="element" style="height: 50px; width: 50px;" />
    `;
    const element = document.getElementById('element');

    jest.spyOn(element, 'offsetTop', 'get').mockReturnValue(100);
    jest.spyOn(element, 'offsetLeft', 'get').mockReturnValue(200);
    jest.spyOn(element, 'offsetHeight', 'get').mockReturnValue(50);
    jest.spyOn(element, 'offsetWidth', 'get').mockReturnValue(50);
    jest.spyOn(element, 'offsetParent', 'get').mockReturnValue(document.body);

    jest.spyOn(document.body, 'scrollHeight', 'get').mockReturnValue(500);
    jest.spyOn(document.body, 'scrollWidth', 'get').mockReturnValue(500);

    const result = positionedOffset(element, undefined);
    expect(result).toEqual({
      top: 100,
      left: 200,
      bottom: 350,
      right: 250,
      _container: document.documentElement,
    });
  });

  it('returns undefined when container is not an HTML element', () => {
    document.body.innerHTML = `
      <div id="element" style="height: 50px; width: 50px;" />
    `;
    const element = document.getElementById('element');

    jest.spyOn(element, 'offsetTop', 'get').mockReturnValue(100);
    jest.spyOn(element, 'offsetLeft', 'get').mockReturnValue(200);
    jest.spyOn(element, 'offsetHeight', 'get').mockReturnValue(50);
    jest.spyOn(element, 'offsetWidth', 'get').mockReturnValue(50);
    jest.spyOn(element, 'offsetParent', 'get').mockReturnValue(document.body);

    jest.spyOn(document.body, 'scrollHeight', 'get').mockReturnValue(500);
    jest.spyOn(document.body, 'scrollWidth', 'get').mockReturnValue(500);

    const result = positionedOffset(element, 'not an HTML element');
    expect(result).toBeUndefined();
  });

  it('returns undefined when element is not part of DOM', () => {
    const detachedElement = document.createElement('div');
    const result = positionedOffset(detachedElement, null);
    expect(result).toBeUndefined();
  });

  it('returns undefined when documentElement does not exist', () => {
    document.body.innerHTML = `
      <div id="element" style="height: 50px; width: 50px;" />
    `;
    const element = document.getElementById('element');

    jest.spyOn(document, 'documentElement', 'get').mockReturnValue(null);

    const result = positionedOffset(element, null);
    expect(result).toBeUndefined();
  });

  it('returns undefined when ownerDocument does not exist', () => {
    document.body.innerHTML = `
      <div id="element" style="height: 50px; width: 50px;" />
    `;

    const element = document.getElementById('element');

    jest.spyOn(element, 'ownerDocument', 'get').mockReturnValue(null);

    const result = positionedOffset(element, null);
    expect(result).toBeUndefined();
  });
});

describe('getDocumentHeight', () => {
  it('returns maximum height', () => {
    const result = getDocumentHeight(document.body, document.documentElement);
    expect(result).toBe(0);
  });
});

describe('getDocumentWidth', () => {
  it('returns maximum width', () => {
    const result = getDocumentWidth(document.body, document.documentElement);
    expect(result).toBe(0);
  });
});
