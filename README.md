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

![Tabs Block](https://raw.githubusercontent.com/eea/volto-tabs-block/master/docs/volto-tabs-block.gif "Tabs Block")

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

## Upgrade
### Upgrading to 7.0.0
Version 7 introduces the following breaking changes:
- The templates are now `variations` of the default template, so if you have custom templates,
  you need to update them to be variations of the default template.
- All variations have `schema enhancers`, see https://github.com/eea/volto-eea-website-theme/blob/develop/src/index.js#L40
  for example on how to customize the variation schema.
- Some defaults have been changed, see the `schema.js` files for any default values.
- Tabs now have the ability to reference an `Image` or use a `Semantic UI` icon within the tab title, even allowing the hiding
  of the text title.
- Responsive template no longer uses `react-responsive-tabs` styles but use `accordion` classes when it's transformed into
  accordion.
  Bring your own style for the accordion if you want to customize it.
- Cleaned up styling in favor of `Semantic UI` styling and to bring your own styling.
- Better `i18n` support for the block especially in edit mode.


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
