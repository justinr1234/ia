<img alt="IA" src="https://raw.githubusercontent.com/justinr1234/ia/master/docs/logo.png" width="200">

[![Circle CI](https://circleci.com/gh/justinr1234/ia.svg?style=svg)](https://circleci.com/gh/justinr1234/ia)
[![Dependency Status](https://david-dm.org/justinr1234/ia.svg)](https://david-dm.org/justinr1234/ia)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Demo

[http://justinr1234-ia.herokuapp.com]([http://justinr1234-ia.herokuapp.com)

## Prerequisites

- [node.js](http://nodejs.org) (Node 5 with npm 3 is required).
- [gulp](http://gulpjs.com/) (`npm install -g gulp`)

If you are using different node versions on your machine, use [nvm](https://github.com/creationix/nvm) to manage them.

## Create App

```shell
git clone https://github.com/justinr1234/ia.git
cd ia
npm install
```

## Start Consumer (and Browser Producer)

- run `gulp`
- point your browser to [localhost:3000](http://localhost:3000)

## Start Consumer (and NodeJS Random Producer)

- run `gulp`
- run `gulp producer`

## Tests

Will run eslint and then mocha tests.

- run `gulp test`

## Diagrams

### Sequence

![Sequence](https://raw.githubusercontent.com/justinr1234/ia/master/docs/sequence-diagram.png)

### Activity

![Activity](https://raw.githubusercontent.com/justinr1234/ia/master/docs/activity-diagram.png)
