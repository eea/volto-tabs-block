# volto-tabs-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-tabs-block)](https://github.com/eea/volto-tabs-block/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-tabs-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-tabs-block/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-tabs-block%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-tabs-block/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block-develop)

[Volto](https://github.com/plone/volto) add-on

## Features

#### IMPORTANT! Because this depends on @eeacms/volto-block-style, you should always load this addon as the last addon in Volto project configuration or after @eeacms/volto-block-style.

###

Demo GIF

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto my-volto-project --addon @eeacms/volto-tabs-block

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-tabs-block        // Not yet available
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
      "@eeacms/volto-tabs-block"
   ],

   "dependencies": {
      "@eeacms/volto-tabs-block": "^1.2.0"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-addon-template/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-tabs-block/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-tabs-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
