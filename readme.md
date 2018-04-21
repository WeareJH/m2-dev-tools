# M2 Dev Tools [![Build Status](https://travis-ci.org/shakyShane/m2-dev-tools.svg?branch=master)](https://travis-ci.org/shakyShane/m2-dev-tools)

## Development 

You can run the code for the Dev Tools with sample data in a normal 
browser window - this is useful   

```bash
yarn
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