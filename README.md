# Chirp

new twitter without the fascists

## Setup

Install [Node Version Manager](https://github.com/nvm-sh/nvm), and [Docker Desktop](https://www.docker.com/products/docker-desktop/).

To get started, run the following commands,

```sh
$ nvm use
$ npm ci
$ npm run build --workspaces
$ make start-dev-resources
$ npm run dev --workspaces
```

To terminate the database, redis cluster, and other supporting background resources,

```sh
$ make stop-dev-resources
```

## NPM Workspace

Chirp is broken up into reusable npm packages with [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces).

All Chirp packages are prefixed with `@chirp`. To install a Chirp package in another Chirp package, run the following command,

```sh
$ npm install @chirp/to-install --workspace @chirp/install-into

# For example, to install @chirp/types into @chirp/lib-node
$ npm install @chirp/types --workspace @chirp/lib-node
```

When installing third-party modules, some packages are kept in the global space (eg: Typescript), but some are only installed within a Chirp package.

```sh
# Install a package for all Chirp packages
$ npm install package-name

# Install for just a single Chirp package
$ npm install package-name --workspace @chirp/package-name
```

You can run one off commands on a package or against all of them,

```sh
$ npm run build --workspace @chirp-package-name
$ npm run build --workspaces
```

However, if you want to run multiple commands in parallel, you'll need to use a custom CLI tool.

```sh
$ ./cli/index.js --command run-all --npm dev
```
