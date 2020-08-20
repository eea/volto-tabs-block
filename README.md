# volto-tabs-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-tabs-block)](https://github.com/eea/volto-tabs-block/releases)

This addon enables ad-hoc grouping of Volto blocks under sections and tabs. It needs to be run with the [Form State Context PR](https://github.com/plone/volto/pull/1711) from Volto. It introduces a "tabs block" which can be used, from the Edit form, to switch between the visible blocks of that tab page. This is achieved by manipulating the form context blocks_layout from the tabs block, made possible once the Form state is exposed as a context. In View mode it manipulates the visible content on the page through changes in the `content` global state reducer.

See demo video below:

[![Short demo](https://img.youtube.com/vi/iTaPsWLGTSQ/0.jpg)](https://www.youtube.com/watch?v=iTaPsWLGTSQ)

## Getting started

1. Create new volto project if you don't already have one:
    ```
    $ npm install -g @plone/create-volto-app
    $ create-volto-app my-volto-project
    $ cd my-volto-project
    ```

1. Update `package.json`:
    ``` JSON
    "addons": [
        "@eeacms/volto-tabs-block"
    ],

    "dependencies": {
        "@plone/volto": "github:eea/volto#7.8.2-beta.2",
        "@eeacms/volto-tabs-block": "github:eea/volto-tabs-block#0.2.0"
    }
    ```

1. Install new add-ons and restart Volto:
    ```
    $ yarn
    $ yarn start
    ```

1. Go to http://localhost:3000

1. Happy editing!

## How to contribute

See [DEVELOP.md](docs/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](docs/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
