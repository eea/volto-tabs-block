# volto-tabs-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-tabs-block)](https://github.com/eea/volto-tabs-block/releases)

This addon enables ad-hoc grouping of Volto blocks under sections and tabs. It uses volto-object-widget as its only dependency.

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
        "@eeacms/volto-object-widget",
        "@eeacms/volto-tabs-block"
    ],

    "dependencies": {
        "@eeacms/volto-object-widget": "github:eea/volto-object-widget#0.1.1",
        "@eeacms/volto-tabs-block": "github:eea/volto-tabs-block#0.2.2"
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

See [DEVELOP.md](DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
