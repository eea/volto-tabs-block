# volto-tabsblock

This addon enables ad-hoc grouping of Volto blocks under sections and tabs. It needs to be run with the [Form State Context PR](https://github.com/plone/volto/pull/1711) from Volto. It introduces a "tabs block" which can be used, from the Edit form, to switch between the visible blocks of that tab page. This is achieved by manipulating the form context blocks_layout from the tabs block, made possible once the Form state is exposed as a context.

See demo video below:

[![Short demo](https://img.youtube.com/vi/iTaPsWLGTSQ/0.jpg)](https://www.youtube.com/watch?v=iTaPsWLGTSQ)

TODO:

- refactor tabs to avoid tabsLayout in tabs block (save tab position directly in block)
- switch vertical/horizontal
- extendable block configuration
- when block is empty without tabs, it doesn't render any content
