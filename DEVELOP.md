# volto-tabs-block

## Develop

1. Make sure you have `docker` and `docker compose` installed and running on your machine:

    ```Bash
    git clone https://github.com/eea/volto-tabs-block.git
    cd volto-tabs-block
    git checkout -b bugfix-123456 develop
    make
    make start
    ```

1. Wait for `Volto started at 0.0.0.0:3000` meesage

1. Go to http://localhost:3000

1. Initialize git hooks

    ```Bash
    yarn prepare
    ```

1. Happy hacking!

### Or add @eeacms/volto-tabs-block to your Volto project

These instructions assume a Cookieplone-based Volto 18+ project. The old `yo @plone/volto` generator is deprecated in Volto 18.

See the official Plone documentation:

- Create an add-on for Volto 18 and 19: https://6.docs.plone.org/volto/development/add-ons/create-an-add-on-18.html
- Install an add-on in development mode in Volto 18 and 19: https://6.docs.plone.org/volto/development/add-ons/install-an-add-on-dev-18.html
- Cookieplone make commands: https://6.docs.plone.org/reference-guide/cookieplone-make-commands.html

1.  Create a new Cookieplone project

        pipx run cookieplone project
        cd my-volto-project
        make install

1.  Add `@eeacms/volto-tabs-block` to the `addons` key in your frontend project's `package.json`, or declare it in `volto.config.js`

1.  Add the following to `frontend/mrs.developer.json`:

        {
            "volto-tabs-block": {
                "output": "packages",
                "url": "https://github.com/eea/volto-tabs-block.git",
                "package": "@eeacms/volto-tabs-block",
                "branch": "develop",
                "path": "src"
            }
        }

1.  Install the development checkout

        make install

1.  Start backend

        make backend-start

1.  Start frontend

        make frontend-start

1.  Go to http://localhost:3000

1.  Happy hacking!

        cd frontend/packages/volto-tabs-block

## Cypress

To run cypress locally, first make sure you don't have any Volto/Plone running on ports `8080` and `3000`.

You don't have to be in a `clean-volto-project`, you can be in any Volto Frontend
project where you added `volto-tabs-block` to `mrs.developer.json`

Go to:

  ```BASH
  cd src/addons/volto-tabs-block/
  ```

Start:

  ```Bash
  make
  make start
  ```

This will build and start with Docker a clean `Plone backend` and `Volto Frontend` with `volto-tabs-block` block installed.

Open Cypress Interface:

  ```Bash
  make cypress-open
  ```

Or run it:

  ```Bash
  make cypress-run
  ```
