# Contributing Guide

Hi! We are really excited that you are interested in contributing to `vuetify-nuxt-module`. Before submitting your contribution, please make sure to take a moment and read through the following guide.

Refer also to https://github.com/antfu/contribute.

## Set up your local development environment

The `vuetify-nuxt-module` repo is a monorepo using pnpm workspaces. The package manager used to install and link dependencies must be [pnpm](https://pnpm.io/).

To develop and test the `vuetify-nuxt-module` package:

1. Fork the `vuetify-nuxt-module` repository to your own GitHub account and then clone it to your local device.

2. `vuetify-nuxt-module` uses pnpm v8. If you are working on multiple projects with different versions of pnpm, it's recommend to enable [Corepack](https://github.com/nodejs/corepack) by running `corepack enable`.

3. Check out a branch where you can work and commit your changes:
```shell
git checkout -b my-new-branch
```

5. Run `pnpm install` in `vuetify-nuxt-module`'s root folder

6. Run `nr dev:prepare` in `vuetify-nuxt-module`'s root folder.

7. Run `nr dev` in `vuetify-nuxt-module`'s root folder.

<!--
## Running tests

Before running tests, you'll need to install [Playwright](https://playwright.dev/) Chromium browser: `pnpm playwright install chromium`.

Run `nr test` in `vuetify-nuxt-module`'s root folder.
-->
