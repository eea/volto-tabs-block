import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuid } from 'uuid';
import { connect } from 'react-redux';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { getBlocks } from '@plone/volto/helpers';
import { settings } from '~/config';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

import { resetContentForEdit, resetTabs, setFixEditStatus } from '../actions';
import { TABSBLOCK } from '../constants';
import {
  globalDeriveTabsFromState,
  tabsLayoutToBlocksLayout,
  isEqual,
} from './utils';
import TabsBlockView from './TabsBlockView';
import TabsSchema from './schema';
import withBlockExtension from './withBlockExtension';

const J = JSON.stringify; // TODO: should use something from lodash

class EditTabsBlock extends React.Component {
  constructor(props) {
    super(props);
    const { properties } = props;
    this.state = {
      blocksLayout: properties.blocks_layout.items, // TODO: use Volto getBlocksFieldname api
    };

    this.saveGlobalLayout = this.saveGlobalLayout.bind(this);
    this.handleChangeBlock = this.handleChangeBlock.bind(this);
    this.isFirstTabsBlock = this.isFirstTabsBlock.bind(this);
  }

  isFirstTabsBlock() {
    const blocks = getBlocks(this.props.properties);
    const [id] = blocks.find(([, value]) => value['@type'] === TABSBLOCK);
    return id === this.props.id;
  }

  componentDidMount() {
    let formData = this.props.properties;
    if (
      Object.keys(formData || {}).includes('_original_items') &&
      // TODO: use recoil atom for shared state?
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
    const { properties } = this.props;
    const blocks = getBlocks(properties);
    const index = blocks.findIndex(([, value]) => value['@type'] === TABSBLOCK);
    if (index === -1) {
      // this.props.setToEditMode(false);
      // TODO: might need to do some stuff here
    }
  }

  componentDidUpdate(prevProps) {
    const { properties, data, tabsState, onChangeField } = this.props;

    const blocksFieldname = getBlocksFieldname(properties);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);

    const blocksLayout = properties[blocksLayoutFieldname].items;

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
        ...properties,
        blocks: {
          ...properties.blocks,
          [this.props.block]: {
            ...properties.blocks[this.props.block],
            tabs,
            tabsLayout,
          },
        },
      };

      const blocks = getBlocks(defaultFormData) || [];
      const new_layout = tabsLayoutToBlocksLayout(blocks, tabsState);

      ReactDOM.unstable_batchedUpdates(() => {
        this.setState({ blocksLayout: new_layout });
        onChangeField(blocksFieldname, {
          ...properties.blocks,
          // We need to create new objects because we mutate in place some arrays
          ...Object.fromEntries(JSON.parse(JSON.stringify(blocks))),
        });
        onChangeField(blocksLayoutFieldname, {
          ...properties.blocks_layout,
          items: new_layout,
        });
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
    const { tabsState, properties, onChangeField } = this.props;
    const formData = defaultFormData || properties;

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
          if (!page?.length) {
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

    const blocksFieldname = getBlocksFieldname(properties);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);

    ReactDOM.unstable_batchedUpdates(() => {
      //   fixed_for_edit: fixed_for_edit || contextData.fixed_for_edit, // keep true
      this.setState({ blocksLayout: new_layout });
      onChangeField(blocksFieldname, {
        ...formData.blocks,
        // We need to create new objects because we mutate in place some arrays
        ...Object.fromEntries(JSON.parse(JSON.stringify(blocks))),
      });
      onChangeField(blocksLayoutFieldname, {
        ...formData.blocks_layout,
        items: new_layout,
      });
    });
  }

  handleChangeBlock(id, value) {
    const { data } = this.props;
    this.props.onChangeBlock(this.props.block, {
      ...data,
      [id]: value,
    });
  }

  getSchema() {
    const schema = TabsSchema();
    schema.properties.block_extension.blockProps = this.props;
    return schema;
  }

  render() {
    const { data, extension } = this.props;
    const { onChangeFieldWrapper, schemaExtender } = extension;

    const schema = this.getSchema();

    return (
      <div
        role="presentation"
        className="block selected"
        onClick={() => {
          this.props.onSelectBlock(this.props.block);
        }}
      >
        <div className="block-inner-wrapper">
          <TabsBlockView {...this.props} mode="edit" />
        </div>
        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={schemaExtender ? schemaExtender(schema) : schema}
            title={schema.title}
            onChangeField={
              onChangeFieldWrapper
                ? onChangeFieldWrapper(this.handleChangeBlock)
                : this.handleChangeBlock
            }
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
)(withBlockExtension(EditTabsBlock));
