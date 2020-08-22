import { v4 as uuid } from 'uuid';
import { connect } from 'react-redux';
import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { getBlocks } from '@plone/volto/helpers';
import {
  resetContentForEdit,
  resetTabs,
} from '@eeacms/volto-tabs-block/actions'; //  reflowBlocksLayout, setToEditMode
import { TABSBLOCK } from '@eeacms/volto-tabs-block/constants';
import { FormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import {
  globalDeriveTabsFromState,
  tabsLayoutToBlocksLayout,
  isEqual,
} from './utils';
import TabsBlockView from './TabsBlockView';
import schema from './schema';
import { settings } from '~/config';

const J = JSON.stringify; // TODO: should use something from lodash

class EditTabsBlock extends React.Component {
  static contextType = FormStateContext;

  constructor(props, context) {
    super(props);
    this.state = {
      blocksLayout: context.contextData.formData.blocks_layout.items,
    };

    this.saveGlobalLayout = this.saveGlobalLayout.bind(this);
    this.handleChangeBlock = this.handleChangeBlock.bind(this);
    this.isFirstTabsBlock = this.isFirstTabsBlock.bind(this);
  }

  isFirstTabsBlock() {
    const blocks = getBlocks(this.context.contextData?.formData || {});
    const [id] = blocks.find(([, value]) => value['@type'] === TABSBLOCK);
    return id === this.props.id;
  }

  componentDidMount() {
    const { contextData } = this.context;
    let formData = this.context.contextData.formData;
    if (
      Object.keys(formData || {}).includes('_original_items') &&
      !contextData.fixed_for_edit
    ) {
      // We're coming from the View page with a layout that already has tabs,
      // so it was changed. In this case restore the original_items as items
      formData = {
        ...formData,
        blocks_layout: {
          ...formData.blocks_layout,
          items: tabsLayoutToBlocksLayout(getBlocks(formData), {}),
        },
      };
      this.props.resetContentForEdit(true, formData); // isEditView = true
      this.globalRelayout({ defaultFormData: formData, fixed_for_edit: true });
      // this.props.resetTabs();
    }

    const blocks = getBlocks(formData);
    const res = blocks.find(([, value]) => value['@type'] === TABSBLOCK);

    if (!res) {
      // the component did not exist in the edit value, it is new
      // so we should use the contextData instead
      this.props.resetContentForEdit(true, formData);
      this.globalRelayout({ defaultFormData: formData, fixed_for_edit: true });
    } else {
      // if this is the first tabs block, relayout the whole form
      const [id] = res;
      if (id === this.props.id) {
        this.props.resetContentForEdit(true, formData);
        this.globalRelayout({
          defaultFormData: formData,
          fixed_for_edit: true,
        });
      }
    }
  }

  componentWillUnmount() {
    const blocks = getBlocks(this.context.contextData?.formData || {});
    const index = blocks.findIndex(([, value]) => value['@type'] === TABSBLOCK);
    if (index === -1) {
      // this.props.setToEditMode(false);
      // TODO: might need to do some stuff here
    }
  }

  componentDidUpdate(prevProps) {
    const { contextData } = this.context;
    const { data, tabsState } = this.props;
    const { formData } = contextData;

    const blocksLayout = formData.blocks_layout.items;

    //   TODO: this needs to be finished
    const { tabs, tabsLayout } = this.props.data;
    if (
      tabs.length &&
      tabs.length < tabsLayout.length
      // || (tabs.length === 0 && tabsLayout.length === 0) // Might cause problems when section is last block
    ) {
      // TODO: handle the case when all tabs are deleted;
      const index = prevProps.data.tabs.findIndex((v, i) => tabs[i] !== v);
      const blockIds = tabsLayout[index];
      const next = index > 0 ? index - 1 : 0;
      tabsLayout.splice(index, 1);
      tabsLayout[next] = [...tabsLayout[next].concat(blockIds)];

      // Did the change involve the current tab?
      if (index === tabsState[this.props.block]) {
        tabsState[this.props.block] = next;
      }

      const defaultFormData = {
        ...formData,
        blocks: {
          ...formData.blocks,
          [this.props.block]: {
            ...formData.blocks[this.props.block],
            tabs,
            tabsLayout,
          },
        },
      };

      const blocks = getBlocks(defaultFormData) || [];
      const new_layout = tabsLayoutToBlocksLayout(blocks, tabsState);
      const { contextData, setContextData } = this.context;
      this.setState({ blocksLayout: new_layout });
      setContextData({
        ...contextData,
        formData: {
          ...formData,
          blocks: {
            ...formData.blocks,
            // We need to create new objects because we mutate in place some arrays
            ...Object.fromEntries(JSON.parse(JSON.stringify(blocks))),
          },
          blocks_layout: {
            ...formData.blocks_layout,
            items: new_layout,
          },
        },
      });
      return;
    }

    const isTabsChanged =
      data.tabsLayout && J(prevProps.tabsState) !== J(tabsState);
    // && isEqual(blocksLayout, this.state.blocksLayout);

    if (isTabsChanged) {
      if (this.isFirstTabsBlock()) {
        return this.globalRelayout({ tabChanged: true });
      }
    }

    const isBlocksChanged =
      data.tabsLayout &&
      J(prevProps.tabsState) === J(tabsState) &&
      !isEqual(blocksLayout, this.state.blocksLayout);

    if (isBlocksChanged) {
      if (this.isFirstTabsBlock()) {
        return this.globalRelayout({});
      }
    }
  }

  createDefaultBlock() {
    const idTrailingBlock = uuid();
    const res = [
      idTrailingBlock,
      {
        '@type': settings.defaultBlockType,
      },
    ];
    return res;
  }

  globalRelayout({
    defaultFormData,
    tabChanged = false,
    fixed_for_edit = false,
  }) {
    const { contextData, setContextData } = this.context;
    const { tabsState } = this.props.tabsState;
    const formData = defaultFormData || contextData.formData;

    const blocks = getBlocks(formData) || [];
    const globalState = globalDeriveTabsFromState({
      blocks,
      tabsState,
      tabChanged,
    });

    blocks.forEach(([id, block]) => {
      if (block['@type'] === TABSBLOCK) {
        block.tabsLayout = globalState[id]; // [activeTab]
        // Create placeholder tabs for "empty" pages in the tabs
        block.tabsLayout.forEach((page, index) => {
          if (page.length === 0) {
            const extra = this.createDefaultBlock();
            formData.blocks[extra[0]] = extra[1];
            block.tabsLayout[index] = [extra[0]];
          }
        });
        const { tabs = [], tabsLayout = [] } = block;
        if (tabs.length < tabsLayout.length) {
          const start = tabs.length - 1;
          tabs.length = tabsLayout.length;
          block.tabs = [...tabs].fill({}, start);
        }
      }
    });

    const new_layout = tabsLayoutToBlocksLayout(blocks, tabsState);

    this.setState({ blocksLayout: new_layout });
    setContextData({
      ...contextData,
      fixed_for_edit: fixed_for_edit || contextData.fixed_for_edit, // keep true
      formData: {
        ...formData,
        blocks: {
          ...formData.blocks,
          // We need to create new objects because we mutate in place some arrays
          ...Object.fromEntries(JSON.parse(JSON.stringify(blocks))),
        },
        blocks_layout: {
          ...formData.blocks_layout,
          items: new_layout,
        },
      },
    });
  }

  handleChangeBlock(id, value) {
    const { data } = this.props;
    this.props.onChangeBlock(this.props.block, {
      ...data,
      [id]: value,
    });
  }

  saveGlobalLayout(new_layout) {
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
    return setContextData(data);
  }

  render() {
    const { data } = this.props;
    return (
      <div
        role="presentation"
        className="block selected"
        onClick={() => {
          this.props.onSelectBlock(this.props.block);
        }}
      >
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
      tabsState: state.tabs_block[state.router.location.key] || {},
      content: state.content,
    };
  },
  {
    resetContentForEdit,
    resetTabs,
  },
)(EditTabsBlock);
