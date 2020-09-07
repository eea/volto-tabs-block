/**
 * A hoc to inject a block extension by resolving the configured extension
 */

import React from 'react';
import { blocks } from '~/config';

export default (WrappedComponent) => (props) => {
  const { data } = props;
  const { extension } = data;
  const type = data['@type'];
  const extensions = blocks.blocksConfig[type].extensions || [];

  const index = extensions.findIndex(
    (conf) => conf.id === (extension || 'default'),
  );

  if (index === -1) {
    throw new Error('You need to register the default extension');
  }

  const extConfig = extensions[index];

  return <WrappedComponent {...props} extension={extConfig} />;
};
