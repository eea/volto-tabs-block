import React from 'react';
import { SelectWidget } from '@plone/volto/components';
import { getBlocksFieldname } from '@plone/volto/helpers';
import { useFormStateContext } from '@plone/volto/components/manage/Form/FormContext';
import { blocks } from '~/config';

const BlockExtensionWidget = (props) => {
  const { block } = props;
  const { contextData } = useFormStateContext();
  const { formData } = contextData;

  const blocksFieldname = getBlocksFieldname(formData);
  const blockData = formData[blocksFieldname][block];
  const type = blockData['@type'];
  const extensions = blocks.blocksConfig[type].extensions || [];

  return (
    <SelectWidget
      {...props}
      choices={extensions.map(({ id, title }) => {
        return [id, title];
      })}
    />
  );
};

export default BlockExtensionWidget;
