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

### Volto Tabs Horizontal

A example of Volto Tabs Horizontal, it look like the following capture:

![Volto Tabs Horizontal](https://github.com/plone-ve/volto-tabs-block/assets/185395/c097d022-cc04-4551-a414-41fdce0329d9 "Volto Tabs Horizontal")

---

### Volto Tabs Vertical

A example of Volto Tabs Vertical, it look like the following capture:

![Volto Tabs Vertical](https://github.com/plone-ve/volto-tabs-block/assets/185395/07ad74c6-7101-4651-b690-e30673ebc0f6 "Volto Tabs Vertical")

---

### Volto Tabs Block Demo

A demonstration example of Volto Tabs Block, it's as the following capture:

![Volto Tabs Block Demo](https://github.com/plone-ve/volto-tabs-block/assets/185395/b8f6cb20-ee02-4bb6-8e91-29462fe2074a "Volto Tabs Block Demo")

---

## Getting started

### Try volto-tabs-block with Docker

      git clone https://github.com/eea/volto-tabs-block.git
      cd volto-tabs-block
      make
      make start

Go to http://localhost:3000

### Add volto-tabs-block to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-tabs-block"
   ],

   "dependencies": {
       "@eeacms/volto-tabs-block": "*"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --canary --addon @eeacms/volto-tabs-block
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-tabs-block/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-tabs-block/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-tabs-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
