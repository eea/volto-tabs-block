import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
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
  it('Should render and switch Tabs', async () => {
    const customTabsData = {
      blocks_layout: {
        items: ['tab1', 'tab2', 'tab3'],
      },
      blocks: {
        tab1: {
          title: 'Tab 1 Title',
          content: 'Tab 1 Content',
        },
        tab2: {
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

    await waitFor(
      () => {
        expect(tabItemsMenu[0].classList).not.toContain('active');
      },
      { timeout: 100 },
    );
    expect(tabItemsMenu[1].classList.contains('active'));

    fireEvent.click(getByText('Tab 1 Title'));
    expect(tabItemsMenu).toHaveLength(3);
    expect(tabItemsMenu[1].classList.contains('item'));
    expect(tabItemsMenu[1].classList).not.toContain('active');
    expect(tabItemsMenu[0].classList.contains('active'));
  });
});
