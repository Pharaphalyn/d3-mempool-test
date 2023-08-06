# d3-mempool-test

## Setting up
Install dependencies
>npm i

Install and run Geth full node.
>https://geth.ethereum.org/

## Configuration
The app may be configured in config.js

```GAS_THRESHOLD``` gas price threshold for highlighting transactions

```VALUE_THRESHOLD``` ETH threshold for highlighting transactions (wei)

```REMOTE_PROVIDER``` web sockets link to a remote web3 provider

```LOCAL_PROVIDER``` web sockets link to a local web3 provider (should be a link to your full node)

```PAIRED_TABLE_SIZE``` paired transactions table size (lines)

```REGULAR_TABLE_SIZE``` all transactions table size (lines)

## Running
>npm start

## Tests
>npm test
