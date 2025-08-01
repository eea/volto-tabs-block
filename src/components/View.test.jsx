import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import View from './View';
import config from '@plone/volto/registry';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import '@testing-library/jest-dom/extend-expect';

config.blocks.blocksConfig = {
  tabs_block: {
    variations: [{ id: 'default' }, { id: 'accordion' }],
  },
};
config.settings = {
  integratesBlockStyles: [],
};
jest.mock('react-router', () => ({
  withRouter: (WrapperComponent) => (props) => {
    return (
      <WrapperComponent
        {...props}
        location={{
          pathname: '/',
          search: '?activeTab=tab1',
          hash: '',
          key: 'qruhb8',
        }}
        history={{
          push: jest.fn(),
        }}
      />
    );
  },
}));

// ENOENT: no such file or directory, open 'node:crypto'
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

jest.mock('@eeacms/volto-block-style/StyleWrapper', () => ({
  StyleWrapperView: (props) => {
    return <div className="mocked-style-wrapper">{props.children}</div>;
  },
}));
const mockStore = configureStore();
const store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
  },
});

describe('View Component', () => {
  it('Should render and switch Tabs', () => {
    const customTabsData = {
      blocks_layout: {
        items: ['test-uuid-1234', 'test-uuid-5678', 'tab3'],
      },
      blocks: {
        'test-uuid-1234': {
          title: 'Tab 1 Title',
          content: 'Tab 1 Content',
        },
        'test-uuid-5678': {
          title: 'Tab 2 Title',
          content: 'Tab 2 Content',
        },
        tab3: {
          title: 'Tab 3 Title',
          content: 'Tab 3 Content',
        },
      },
    };

    const { container, getByText } = render(
      <Provider store={store}>
        <Router>
          <View data={{ variation: 'default', data: customTabsData }} />
        </Router>
      </Provider>,
    );
    const tabItemsMenu = container.querySelectorAll(
      '.ui.tabs-secondary-variant.menu a',
    );

    expect(
      container.querySelector('.tabs-block.default.light.flex-start'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.default.tabs.tabs-accessibility'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('.ui.tabs-secondary-variant.menu'),
    ).toBeInTheDocument();
    expect(
      container.getElementsByClassName('mocked-style-wrapper'),
    ).toHaveLength(2);
    expect(getByText('Tab 1 Title')).toBeInTheDocument();

    fireEvent.click(getByText('Tab 2 Title'));
    expect(tabItemsMenu).toHaveLength(3);
    expect(tabItemsMenu[0].classList.contains('item'));
    expect(tabItemsMenu[0].classList).not.toContain('active');
    expect(tabItemsMenu[1].classList.contains('active'));

    fireEvent.click(getByText('Tab 1 Title'));
    expect(tabItemsMenu).toHaveLength(3);
    expect(tabItemsMenu[1].classList.contains('item'));
    expect(tabItemsMenu[1].classList).not.toContain('active');
    expect(tabItemsMenu[0].classList.contains('active'));
  });
});
