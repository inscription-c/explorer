# C-INS Browser

![License](https://img.shields.io/github/license/inscription-c/explorer)
![Issues](https://img.shields.io/github/issues/inscription-c/explorer)
![PRs](https://img.shields.io/github/issues-pr/inscription-c/explorer)
[![Deploy mainnet environment](https://github.com/inscription-c/explorer/actions/workflows/mainnet.yml/badge.svg?branch=main)](https://github.com/inscription-c/explorer/actions/workflows/mainnet.yml)
[![Deploy testnet environment](https://github.com/inscription-c/explorer/actions/workflows/testnet.yml/badge.svg)](https://github.com/inscription-c/explorer/actions/workflows/testnet.yml)


This is the fronted for the C-INS project. It is a web application that allows users to query and inscribe inscriptions.

- Mainnet environment: https://c-ins.com
- Testnet environment: https://testnet-explorer.c-ins.com/


## About C-INS

C-INS is a new inscription protocol for Bitcoin. For further details, please refer to the [document](https://docs.c-ins.com/)


## Installation

### Prerequisites

This project is a single-page application (SPA) built with [Vue](https://vuejs.org/) that relies on two backend services:

- https://github.com/inscription-c/explorer-api which provides the explorer API.
- https://github.com/inscription-c/cins which provides the inscription indexer API and requires a Bitcoin fullnode.

And for building this project you will need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) to be installed on your system.

### Building

Once both services are running, copy and paste the `.env` file to create a new file named `.env.local`. In this new file, set the variables `VUE_APP_EXPLORER_API` and `VUE_APP_INS_API` to the URLs of the explorer and indexer APIs. Then, you can start the frontend by using the following commands:

```bash
# Install the dependencies
npm install

# Build the project
npm build:mainnet

# or for testnet
npm build:testnet
```

Then, the `dist` folder will be created for deployment.

### Deployments

You can host the `dist` folder on any web server or static assets service like GitHub Pages or Cloudflare Pages.


## Development

### Prerequisites

The whole project is writen in TypeScript and use [Vue](https://vuejs.org/) as the main framework. And [Vuetify](https://vuetifyjs.com/) as the UI library. And the build tool is [Vite](https://vitejs.dev/). So you will need to be fimiliar with these technologies to contribute to this project.

### Get started

To start development, you can use the following commands:

```bash
# Install the dependencies
npm install

# Start the development server
npm dev
```

Then, the [vite](https://vitejs.dev/) development server will start and you can access the application locally.


## Contributing Guide

Please read the [guide](https://docs.c-ins.com/contributing.html) for more information.


## License

This repository is released under the terms of the MIT license. See LICENSE for more information or see https://choosealicense.com/licenses/mit/.
