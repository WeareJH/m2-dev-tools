# M2 Dev Tools [![Build Status](https://travis-ci.org/shakyShane/m2-dev-tools.svg?branch=master)](https://travis-ci.org/shakyShane/m2-dev-tools)

## About

This is a chrome extension that provides the user with a tree-view of the container/block structure
of any page in a Magento 2 website 

<img src="https://media.giphy.com/media/cIIlwdKYkKNp6VnMoY/giphy.gif"/>

## Usage 

* 1. First, install & enable [m2-module-jh-block-logger](https://github.com/WeareJH/m2-module-jh-block-logger)
* 2. Then add this extension via the Chrome Extension Store

## Development 

Run the following command to launch a version of the Chrome Extension in a regular browser window.

```bash
# install dependencies
yarn

# start the development server
yarn start
```

<!--crossbow-docs-start-->
## Crossbow tasks

The following tasks have been defined by this project's Crossbow configuration.
Run any of them in the following way
 
```shell
$ crossbow run <taskname>
```
|Task name|Description|
|---|---|
|<pre>`test`</pre>|**Alias for:**<br>- `build-all`<br>- `mocha`<br>- `cypress`|
|<pre>`mocha`</pre>|**Alias for:**<br>- `@npm mocha -r ts-node/register tests/**`|
|<pre>`cypress`</pre>|**Alias for:**<br>- `cypress/setup/run.js`|
|<pre>`cypress-open`</pre>|**Alias for:**<br>- `@npm cypress open --env TEST_URL=http://localhost:8080/plain.html`|
|<pre>`build-all`</pre>|Build all shells.|
|<pre>`webpack`</pre>|**Alias for:**<br>- `@npm webpack`|
|<pre>`start`</pre>|Run the application in a regular Browser window with sample data + cypress|
|<pre>`app-watch`</pre>|**Alias for:**<br>- `@npm webpack-dev-server --inline`|
|<pre>`lc`</pre>|**Alias for:**<br>- `@sh /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --auto-open-devtools-for-tabs https://gg.m2`|
|<pre>`clean`</pre>|**Alias for:**<br>- `@sh rm -rf shells/chrome/dist/**`|
<!--crossbow-docs-end-->