# M2 Dev Tools

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
|<pre>`build-all`</pre>|Build all shells.|
|<pre>`start`</pre>|Run the application in a regular Browser window with sample data|
|<pre>`build-chrome`</pre>|**Alias for:**<br>- `@npm parcel build chrome.html --out-dir shells/chrome/dist --no-cache`|
|<pre>`app-watch`</pre>|**Alias for:**<br>- `@npm parcel plain.html`|
|<pre>`lc`</pre>|**Alias for:**<br>- `@sh /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome https://selco.m2`|
|<pre>`chrome`</pre>|**Alias for:**<br>- `@npm tsc src/chrome/** --outdir shells/chrome/build`|
|<pre>`chrome-watch`</pre>|**Alias for:**<br>- `@npm tsc src/chrome/** -w --outdir shells/chrome/build`|
|<pre>`clean`</pre>|**Alias for:**<br>- `@sh rm -rf shells/chrome/dist/**`|
<!--crossbow-docs-end-->