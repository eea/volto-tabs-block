import React from 'react';
import { render } from '@testing-library/react';
import SimpleMarkdown from './SimpleMarkdown';
import '@testing-library/jest-dom/extend-expect';

describe('SimpleMarkdown', () => {
  it('renders empty when no markdown is provided', () => {
    const { container } = render(<SimpleMarkdown />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders pararaph with the tag provided when no text is provided with the markdown', () => {
    const { getByText } = render(<SimpleMarkdown md="#" />);
    expect(getByText('#').tagName).toBe('P');
  });

  it('renders paragraph when no tag is provided', () => {
    const { getByText } = render(<SimpleMarkdown md="test test" />);
    expect(getByText('test test').tagName).toBe('P');
  });

  it('renders h1 when # tag is provided', () => {
    const { getByText } = render(<SimpleMarkdown md="# test test" />);
    expect(getByText('test test').tagName).toBe('H1');
  });

  it('renders h2 when ## tag is provided', () => {
    const { getByText } = render(<SimpleMarkdown md="## test test" />);
    expect(getByText('test test').tagName).toBe('H2');
  });

  it('renders h3 when ### tag is provided', () => {
    const { getByText } = render(<SimpleMarkdown md="### test test" />);
    expect(getByText('test test').tagName).toBe('H3');
  });

  it('renders h4 when #### tag is provided', () => {
    const { getByText } = render(<SimpleMarkdown md="#### test test" />);
    expect(getByText('test test').tagName).toBe('H4');
  });

  it('renders h5 when ##### tag is provided', () => {
    const { getByText } = render(<SimpleMarkdown md="##### test test" />);
    expect(getByText('test test').tagName).toBe('H5');
  });
  it('renders h6 when ###### tag is provided', () => {
    const { getByText } = render(<SimpleMarkdown md="###### test test" />);
    expect(getByText('test test').tagName).toBe('H6');
  });
});
