import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';
import config from '@plone/volto/registry';
import Edit from './Edit';
import { TABS_BLOCK } from '@eeacms/volto-tabs-block/constants';

vi.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

vi.mock('@eeacms/volto-tabs-block/constants', () => ({
  TABS_BLOCK: 'tabs_block',
}));

vi.mock('@eeacms/volto-tabs-block/helpers', () => ({
  empty: vi.fn(),
  emptyTab: vi.fn(() => ({})),
  getVariation: vi.fn(() => 'default'),
}));

vi.mock('@eeacms/volto-tabs-block/components', () => ({
  AssetTab: ({ tabTitle }) => <span>{tabTitle}</span>,
}));

vi.mock(
  '@eeacms/volto-tabs-block/components/variations/default/schema',
  () => ({
    defaultSchemaEnhancer: vi.fn(({ schema }) => schema),
  }),
);

vi.mock('@eeacms/volto-tabs-block/utils', () => ({
  SimpleMarkdown: ({ md, className }) => <div className={className}>{md}</div>,
  getMenuPosition: () => ({}),
}));

vi.mock('@eeacms/volto-tabs-block/less/edit.less', () => ({}));

vi.mock('@eeacms/volto-tabs-block/less/tabs.less', () => ({}));

vi.mock('@eeacms/volto-tabs-block/less/menu.less', () => ({}));

vi.mock('./variations/default', async () => ({
  DefaultEdit: (await vi.importActual('./variations/default/Edit')).default,
}));

vi.mock('@plone/volto/components/manage/Sidebar/SidebarPortal', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('@plone/volto/components/manage/Blocks/Block/BlocksForm', () => ({
  __esModule: true,
  default: vi.fn(
    ({ multiSelected, onSelectBlock, properties, selectedBlock }) => {
      const blockList = properties.blocks
        ? Object.entries(properties.blocks)
        : [];

      return (
        <div
          data-testid={`blocks-form-${properties.title || 'untitled'}`}
          data-multi-selected={(multiSelected || []).join(',')}
          data-selected-block={selectedBlock || ''}
        >
          {blockList.map(([blockId]) => (
            <button
              key={blockId}
              type="button"
              aria-label={`Select ${blockId}`}
              onClick={(event) => onSelectBlock?.(blockId, null, event)}
            >
              Select {blockId}
            </button>
          ))}
        </div>
      );
    },
  ),
}));

vi.mock('@plone/volto/components/manage/Form/BlocksToolbar', () => ({
  __esModule: true,
  default: ({ selectedBlock, selectedBlocks }) => (
    <div
      data-testid="blocks-toolbar"
      data-selected-block={selectedBlock || ''}
      data-selected-blocks={(selectedBlocks || []).join(',')}
    />
  ),
}));

vi.mock('@plone/volto/components/manage/Form/BlockDataForm', () => ({
  __esModule: true,
  default: () => <div>BlockDataForm</div>,
}));

vi.mock('@eeacms/volto-block-style/StyleWrapper', () => ({
  StyleWrapperView: ({ children }) => <>{children}</>,
}));

vi.mock('@eeacms/volto-block-style/BlockStyleWrapper', () => ({
  BlockStyleWrapperEdit: ({ children }) => <>{children}</>,
}));

const mockStore = configureStore();
const store = mockStore({
  intl: {
    locale: 'en',
    messages: {},
  },
  screen: {
    page: {
      width: 768,
    },
  },
});

const mockData = {
  title: 'Tabs',
  data: {
    blocks: {
      tab1: {
        '@type': 'tab',
        title: 'Tab 1',
        blocks: {
          block1: {
            '@type': 'text',
          },
          block2: {
            '@type': 'text',
          },
        },
        blocks_layout: {
          items: ['block1', 'block2'],
        },
      },
    },
    blocks_layout: {
      items: ['tab1'],
    },
  },
};

describe('Tabs Edit', () => {
  beforeEach(() => {
    config.blocks.blocksConfig[TABS_BLOCK] = {
      ...config.blocks.blocksConfig[TABS_BLOCK],
      blockSchema: () => ({
        title: 'Tabs',
        properties: {
          data: {
            schema: {},
          },
        },
      }),
      variations: [{ id: 'default' }],
    };
    config.settings = {
      ...config.settings,
      defaultBlockType: 'text',
    };
  });

  it('forwards nested multi selection and tracks the active inner block in the toolbar', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Edit
            block="tabs-block"
            data={mockData}
            onChangeBlock={vi.fn()}
            onChangeField={vi.fn()}
            selected={true}
            setSidebarTab={vi.fn()}
            blockNode={{ current: document.createElement('div') }}
          />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select block1' }));

    expect(screen.getByTestId('blocks-toolbar')).toHaveAttribute(
      'data-selected-block',
      'block1',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Select block2' }), {
      shiftKey: true,
    });

    expect(screen.getByTestId('blocks-form-Tab 1')).toHaveAttribute(
      'data-multi-selected',
      'block1,block2',
    );
    expect(screen.getByTestId('blocks-toolbar')).toHaveAttribute(
      'data-selected-blocks',
      'block1,block2',
    );
  });
});
