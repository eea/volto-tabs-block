import React from 'react';

const TAGS = {
  '': (text, props) => <p {...props}>{text}</p>,
  '#': (text, props) => <h1 {...props}>{text}</h1>,
  '##': (text, props) => <h2 {...props}>{text}</h2>,
  '###': (text, props) => <h3 {...props}>{text}</h3>,
  '####': (text, props) => <h4 {...props}>{text}</h4>,
  '#####': (text, props) => <h5 {...props}>{text}</h5>,
  '######': (text, props) => <h6 {...props}>{text}</h6>,
};

const SimpleMarkdown = (props) => {
  const { md = '', defaultTag = '' } = props;
  const [TAG, ...text] = md.split(' ');
  const attrs = {
    ref: props.ref,
    className: props.className,
    id: props.id,
    style: props.style,
  };

  if (!md) return <React.Fragment />;
  if (!text.length) return TAGS[defaultTag]?.(TAG, attrs);
  if (!(TAG in TAGS)) {
    text.unshift(TAG);
    return TAGS[defaultTag]?.(text.join(' '), attrs);
  }
  return TAGS[TAG]?.(text.join(' '), attrs);
};

export default SimpleMarkdown;
