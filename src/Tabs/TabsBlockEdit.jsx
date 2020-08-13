import { connect } from 'react-redux';
import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { getBlocks } from '@plone/volto/helpers';
import { TABSBLOCK } from 'volto-tabsblock/constants';
import { FormStateContext } from '@plone/volto/components/manage/Form/FormContext';

import {
  globalDeriveTabsFromState,
  // deriveTabsFromState,
  tabsLayoutToBlocksLayout,
  isEqual,
} from './utils';
import TabsBlockView from './TabsBlockView';
import schema from './schema';

const J = JSON.stringify; // TODO: should use something from lodash

// there has been changes in the overall layout, we need to sync it to
// the tabs layout

// unfortunately we don't have events or reducers in Volto's Form.jsx
// that would make this easier, so we need a way to understand how to
// divide the tabs. We take advantage that we control where the tabs can
// appear (the activeTab).
//
// A block can only appear or dissapear in the activeTab
// When it appears, we need to see which other block is before it
// The same when it dissapears

class EditTabsBlock extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      blocksLayout: context.contextData.formData.blocks_layout.items,
    };

    this.updateGlobalBlocksLayout = this.updateGlobalBlocksLayout.bind(this);
  }

  static contextType = FormStateContext;

  handleChangeBlock(id, value) {
    const { data } = this.props;
    this.props.onChangeBlock(this.props.block, {
      ...data,
      [id]: value,
    });
  }

  render() {
    const { data } = this.props;
    return (
      <div className="block selected">
        <div className="block-inner-wrapper">
          <TabsBlockView {...this.props} />
        </div>
        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={schema}
            title={schema.title}
            onChangeField={this.handleChangeBlock.bind(this)}
            formData={data}
            block={this.props.block}
          />
        </SidebarPortal>
      </div>
    );
  }

  updateGlobalBlocksLayout(new_layout) {
    const { contextData, setContextData } = this.context;
    const data = {
      ...contextData,
      formData: {
        ...contextData.formData,
        blocks_layout: {
          ...contextData.formData.blocks_layout,
          items: new_layout,
        },
      },
    };
    setContextData(data);
  }

  componentDidMount() {
    // initialize tabsLayout when just created

    const { block, onChangeBlock, data } = this.props;
    const { tabsLayout = [], tabs = [] } = this.props.data;

    if (tabs.length !== tabsLayout.length) {
      // TODO: create new placeholder blocks
      tabsLayout.fill([], tabsLayout.length, tabs.length);
      return onChangeBlock(block, { ...data, tabs, tabsLayout });
    }

    const { formData } = this.context.contextData;
    const blocks_layout = tabsLayoutToBlocksLayout(
      formData,
      this.props.tabsState,
    );
    this.updateGlobalBlocksLayout(blocks_layout);
  }

  componentDidUpdate(prevProps) {
    // const { tabsLayout = [], tabs = [] } = this.props.data;

    const { contextData, setContextData } = this.context;
    const { data, onChangeBlock, block, tabsState } = this.props;
    // const activeTab = tabsState[block] || 0;
    const { formData } = contextData;
    const blocks = getBlocks(formData) || [];

    if (!data.initialized) {
      // if the tab has just been dropped, it hasn't been initialized
      // In this case, we initialize the tabsLayout and update as initialized
      const allTabs = globalDeriveTabsFromState({ blocks, tabsState });
      const res = allTabs[block] || [];
      const blockIndex = blocks
        .filter(([id, value]) => value['@type'] === TABSBLOCK)
        .findIndex(([id]) => id === block);
      const newData = {
        ...data,
        initialized: true,
        tabsLayout: res[blockIndex] || [],
      };
      onChangeBlock(block, newData);
      console.log('data initialized', newData);
      return;
    }

    const blocksLayout = formData.blocks_layout.items;

    const isTabsChanged =
      data.tabsLayout && J(prevProps.tabsState) !== J(tabsState);
    // && isEqual(blocksLayout, this.state.blocksLayout);

    const isBlocksChanged =
      data.tabsLayout &&
      J(prevProps.tabsState) === J(tabsState) &&
      !isEqual(blocksLayout, this.state.blocksLayout);

    console.log(
      'tabsLayout',
      J(data.tabsLayout),

      '\n\n\n\nprevPropsTabState',
      J(prevProps.tabsState),

      '\n\n\n\ntabsState',
      J(tabsState),

      '\n\n\n\nblocksLayout',
      J(blocksLayout),

      '\n\n\n\nstate blocksLayout',
      J(this.state.blocksLayout),
    );

    let new_layout;

    if (isTabsChanged) {
      // calculate layout based on changing tabs
      new_layout = tabsLayoutToBlocksLayout(contextData.formData, tabsState);
      this.setState({ blocksLayout: new_layout }, () => {
        this.updateGlobalBlocksLayout(new_layout);
        console.log('tab has changed', new_layout);
      });
      return;
    }

    if (isBlocksChanged) {
      console.log('isBlocksChanged', isBlocksChanged);
      // calculate layout based on mutations in tabs
      const flat_layout = tabsLayoutToBlocksLayout(
        contextData.formData,
        tabsState,
      );
      if (JSON.stringify(flat_layout) !== JSON.stringify(blocksLayout)) {
        console.log('flat_layout', flat_layout);
        // new_layout = globalDeriveTabsFromState({ blocks, tabsState });
        // console.log('new_layout', new_layout);
        this.setState({ blocksLayout: flat_layout }, () => {
          this.updateGlobalBlocksLayout(flat_layout);
        });
        // console.log('\n\nnew block layout:\n', new_layout);
        // this.updateGlobalBlocksLayout(new_layout);
      }
    }
  }
}

export default connect(
  (state) => {
    return {
      tabsState: state.tabs_block,
    };
  },
  {
    //
  },
)(EditTabsBlock);
