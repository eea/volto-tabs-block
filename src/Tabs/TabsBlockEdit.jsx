import { connect } from 'react-redux';
import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { getBlocks } from '@plone/volto/helpers';
import { resetContentForEdit } from 'volto-tabsblock/actions'; //  reflowBlocksLayout, setToEditMode
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
    // console.log(
    //   'initial formData',
    //   JSON.stringify(formData.blocks_layout.items),
    // );
    // debugger;
    if (
      Object.keys(formData || {}).includes('_original_items') &&
      !contextData.fixed_for_edit
    ) {
      // We're coming from the View page with a layout that already has tabs,
      // so it was changed. In this case restore the original_items as items
      // formData = {
      //   ...formData,
      //   blocks_layout: {
      //     ...formData.blocks_layout,
      //     items: formData._original_items,
      //   },
      // };
      formData = {
        ...formData,
        blocks_layout: {
          ...formData.blocks_layout,
          items: tabsLayoutToBlocksLayout(getBlocks(formData), {}),
        },
      };
      this.props.resetContentForEdit(true, formData); // isEditView = true
      this.globalRelayout({ defaultFormData: formData, fixed_for_edit: true });
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
    }
  }

  componentDidUpdate(prevProps) {
    const { contextData, setContextData } = this.context;
    const { data, tabsState } = this.props;
    const { formData } = contextData;
    const blocks = getBlocks(formData) || [];

    const blocksLayout = formData.blocks_layout.items;

    let new_layout;

    const { tabsLayout = [], tabs = [] } = this.props.data;
    // if (
    //   tabs.length &&
    //   tabs.length !== tabsLayout.length
    //   // || (tabs.length === 0 && tabsLayout.length === 0) // Might cause problems when section is last block
    // ) {
    //   // console.log(
    //   //   'relayout',
    //   //   this.props.id,
    //   //   tabs.length,
    //   //   tabsLayout.length,
    //   //   JSON.stringify(tabs),
    //   //   JSON.stringify(tabsLayout),
    //   // );
    //   console.log('Tabs have been edited');
    //   return this.globalRelayout();
    // }

    const isTabsChanged =
      data.tabsLayout && J(prevProps.tabsState) !== J(tabsState);
    // && isEqual(blocksLayout, this.state.blocksLayout);
    // console.log(data.tabsLayout, prevProps.tabsState, tabsState);

    if (isTabsChanged) {
      // console.log('tabs schanged');
      // // calculate layout based on changing tabs
      // new_layout = tabsLayoutToBlocksLayout(blocks, tabsState);
      // // console.log('tabsChanged', new_layout, tabsState, blocks);
      // this.setState({ blocksLayout: new_layout });
      // this.saveGlobalLayout(new_layout);
      // return;
      if (this.isFirstTabsBlock()) {
        console.log(
          'tabs changed',
          blocksLayout.length,
          this.state.blocksLayout.length,
          tabsState,
        );
        return this.globalRelayout({ tabChanged: true });
      }
    }

    const isBlocksChanged =
      data.tabsLayout &&
      J(prevProps.tabsState) === J(tabsState) &&
      !isEqual(blocksLayout, this.state.blocksLayout);

    if (isBlocksChanged) {
      if (this.isFirstTabsBlock()) {
        console.log(
          'block changed',
          blocksLayout.length,
          this.state.blocksLayout.length,
          tabsState,
        );
        return this.globalRelayout({});
      }
    }
  }

  globalRelayout({
    defaultFormData,
    tabChanged = false,
    fixed_for_edit = false,
  }) {
    // TODO: create new placeholder blocks
    const { contextData, setContextData } = this.context;
    const { tabsState } = this.props;
    const formData = defaultFormData || contextData.formData;

    const blocks = getBlocks(formData) || [];
    let new_layout;
    const globalState = globalDeriveTabsFromState({
      blocks,
      tabsState,
      tabChanged,
    });

    blocks.forEach(([id, block]) => {
      if (block['@type'] === TABSBLOCK) {
        block['tabsLayout'] = globalState[id]; // [activeTab]
        const { tabs = [], tabsLayout = [] } = block;
        if (tabs.length < tabsLayout.length) {
          const start = tabs.length - 1;
          tabs.length = tabsLayout.length;
          block.tabs = [...tabs].fill({}, start);
          console.log('tabs', block);
        }
      }
    });

    new_layout = tabsLayoutToBlocksLayout(blocks, tabsState);
    console.log(
      'global relayout end',
      new_layout,
      contextData.formData.blocks_layout.items,
    );

    this.setState({ blocksLayout: new_layout });
    setContextData({
      ...contextData,
      fixed_for_edit: fixed_for_edit || contextData.fixed_for_edit, // keep true
      formData: {
        ...formData,
        blocks: {
          ...formData.blocks,
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
          <div>
            <strong>Saved edit data:</strong> {JSON.stringify(this.props.data)}
          </div>
          {this.context.contextData.formData.blocks_layout.items.length}
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
      content: state.content,
    };
  },
  {
    // setToEditMode,
    resetContentForEdit,
  },
  // (dispatch) => {
  //   return {
  //     // reflowBlocksLayout: () => dispatch(reflowBlocksLayout()),
  //     setToEditMode: (mode, content) => dispatch(setToEditMode(mode, content)),
  //     dispatch,
  //   };
  // },
)(EditTabsBlock);
