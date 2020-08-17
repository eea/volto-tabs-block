import { connect } from 'react-redux';
import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { getBlocks } from '@plone/volto/helpers';
import { TABSBLOCK } from 'volto-tabsblock/constants';
import { FormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import {
  globalDeriveTabsFromState,
  tabsLayoutToBlocksLayout,
  isEqual,
} from './utils';
import TabsBlockView from './TabsBlockView';
import schema from './schema';

const J = JSON.stringify; // TODO: should use something from lodash

class EditTabsBlock extends React.Component {
  static contextType = FormStateContext;

  constructor(props, context) {
    super(props);
    this.state = {
      blocksLayout: context.contextData.formData.blocks_layout.items,
    };

    this.updateGlobalBlocksLayout = this.updateGlobalBlocksLayout.bind(this);
    this.handleChangeBlock = this.handleChangeBlock.bind(this);
  }

  componentDidMount() {
    // initialize tabsLayout when just created

    const { block, onChangeBlock, data, tabsState } = this.props;
    const { tabsLayout = [], tabs = [] } = this.props.data;

    if (tabs.length !== tabsLayout.length) {
      // TODO: create new placeholder blocks
      tabsLayout.fill([], tabsLayout.length, tabs.length);

      // TODO: write this in state
      return onChangeBlock(block, { ...data, tabs, tabsLayout });
    }

    const { formData } = this.context.contextData;
    const blocks = getBlocks(formData);

    if (!data.initialized) {
      // if the tab has just been dropped, it hasn't been initialized
      // In this case, we initialize the tabsLayout and update as initialized
      const allTabs = globalDeriveTabsFromState({ blocks, tabsState });
      const tabsLayout = allTabs[block] || [];
      const newData = {
        ...data,
        initialized: true,
        tabsLayout,
      };
      onChangeBlock(block, newData);
      return;
    }

    const new_layout = tabsLayoutToBlocksLayout(getBlocks(formData), tabsState);

    this.setState({ blocksLayout: new_layout });
    this.updateGlobalBlocksLayout(new_layout);
  }

  componentDidUpdate(prevProps) {
    const { contextData, setContextData } = this.context;
    const { data, tabsState } = this.props;
    const { formData } = contextData;
    const blocks = getBlocks(formData) || [];

    const blocksLayout = formData.blocks_layout.items;

    const isTabsChanged =
      data.tabsLayout && J(prevProps.tabsState) !== J(tabsState);
    // && isEqual(blocksLayout, this.state.blocksLayout);

    let new_layout;

    if (isTabsChanged) {
      // calculate layout based on changing tabs
      new_layout = tabsLayoutToBlocksLayout(blocks, tabsState);
      this.setState({ blocksLayout: new_layout });
      this.updateGlobalBlocksLayout(new_layout);
      return;
    }

    const isBlocksChanged =
      data.tabsLayout &&
      J(prevProps.tabsState) === J(tabsState) &&
      !isEqual(blocksLayout, this.state.blocksLayout);

    if (isBlocksChanged) {
      const globalState = globalDeriveTabsFromState({ blocks, tabsState });
      // update all tabs blocks based on new_layout
      blocks.forEach(([id, block]) => {
        if (block['@type'] === TABSBLOCK) {
          const activeTab = tabsState[id] || 0;
          if (!Array.isArray(block['tabsLayout'])) {
            block['tabsLayout'] = Array(activeTab + 1).fill([]);
          }
          block['tabsLayout'] = globalState[id]; // [activeTab]
        }
      });

      new_layout = tabsLayoutToBlocksLayout(blocks, tabsState);

      // Note: these two setState updates are optimized by React in a single
      // component update. This is cool.
      this.setState({ blocksLayout: new_layout });
      setContextData({
        ...contextData,
        formData: {
          ...formData,
          blocks: {
            ...formData.blocks,
            ...Object.fromEntries(blocks),
          },
          blocks_layout: {
            ...formData.blocks_layout,
            items: new_layout,
          },
        },
      });
    }
  }

  handleChangeBlock(id, value) {
    const { data } = this.props;
    this.props.onChangeBlock(this.props.block, {
      ...data,
      [id]: value,
    });
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

  render() {
    const { data } = this.props;
    return (
      <div className="block selected">
        <div className="block-inner-wrapper">
          <TabsBlockView
            {...this.props}
            properties={this.context?.contextData?.formData}
            mode="edit"
          />
        </div>
        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={schema}
            title={schema.title}
            onChangeField={this.handleChangeBlock}
            formData={data}
            block={this.props.block}
          />
        </SidebarPortal>
      </div>
    );
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
