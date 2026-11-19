# @eeacms/volto-tabs-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-tabs-block)](https://github.com/eea/volto-tabs-block/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-tabs-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-tabs-block/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-tabs-block&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-tabs-block)

[Volto](https://github.com/plone/volto) add-on

## Features

#### IMPORTANT! Because this depends on @eeacms/volto-block-style, you should always load this addon as the last addon in Volto project configuration or after @eeacms/volto-block-style.

###

![Tabs Block](https://raw.githubusercontent.com/eea/volto-tabs-block/master/docs/volto-tabs-block.gif "Tabs Block")

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)

### Frontend

- Node.js: `>=22.0.0`

## Installation

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "dependencies": {
       "@eeacms/volto-tabs-block": "*"
   }
   ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-tabs-block'];
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

   Then install the add-on in your frontend project. For Cookieplone-based Volto 18 and 19 projects, Plone documents `pnpm` usage:

   ```
   pnpm --filter <name-of-your-policy-add-on> add @eeacms/volto-tabs-block
   ```

   Then add `@eeacms/volto-tabs-block` to the `addons` key in your project's `package.json` or declare it in `volto.config.js`.

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Upgrade

### Upgrading to 11.x

> This version requires `Volto 18` or `Volto 19` and Node.js 22.

The block, its variations and its schema keep the same API, so upgrading from 10.x on Volto 18 needs no content changes. The release adds Volto 19 support and moves the repository to the Volto 19 layout, where the published package lives in `packages/volto-tabs-block`.

#### Breaking changes

- **Node.js 22 or newer is required** (`engines.node >= 22`), 10.x declared no engine.
- **React 18 is required.** The package declares `react` and `react-dom` as `^18.2.0` peers, 10.x declared no peers.
- **The package no longer ships the Jest setup.** `jest-addon.config.js` and `jest.setup.js` were removed in favour of Vitest, so a Volto 18 project that still runs the Jest harness has to keep its own copy.

The asset image is now rendered with Volto's `Image` component instead of the `semantic-ui-react` one, and `react-resize-detector` is declared as a dependency; the add-on imported it before without declaring it.

### Upgrading to 10.x

> This version requires `Volto >= 17.18` or `Volto 18+`. It removes the custom `EditBlockWrapper` and uses Volto's built-in block chrome provided by `BlocksForm`.

#### Breaking changes

- **Removed `EditBlockWrapper.jsx`.** Any code importing `EditBlockWrapper` from `@eeacms/volto-tabs-block` will break. Use Volto's built-in `EditBlockWrapper` from `@plone/volto/components/manage/Blocks/Block/EditBlockWrapper` if you need a custom wrapper.
- **Removed custom edit toolbar styles.** The `edit.less` styles that powered the custom inner block toolbar have been removed. Inner blocks now use Volto's default block chrome.

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

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
