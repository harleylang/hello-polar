# `<hello-polar>` Learn polar on the web `</hello-polar>`

The `<hello-polar></hello-polar>` web component provides an interface for teaching the Polar language.

Via the `context` attribute, educators can specify objectives for the learner's Polar policy.

```
<hello-polar context='{ "tests": [ { "desc": "An example", "query": ["_","_","_"], "expected": false } ]}'></hello-polar>
```

The policies written by the user are loaded into the Oso policy engine, and then each objective is tested. Results are displayed to the user, and confetti appears when the user's policies pass each objective. 

## Installation

### Via NPM:

```
npm i https://github.com/harleylang/hello-polar
```

To embed:

```
...
<script src='./node_modules/try-oso/dist/index.js></script>
<hello-polar context='{ "tests": []}'></hello-polar>
...
```

Depending on your frontend, the contents of `/dist` (except `index.html` and `data.js`) may need to be placed in your static directory.

## Building

```
# build oso to static directory
cd /oso
npm i
npm run build
# build web component
npm i
npm run build
# preview production build
npm run serve
```

## Credits

* Oso is bundled and loaded as described in Stephen Olsen's repository, [oso-broswer-quickstart](https://github.com/osohq/oso-browser-quickstart).

## TODO:

* [ ] Expand api: classes
* [ ] Expand api: initial polar values
* [ ] Expand api: hints
* [ ] Expand api: solutions

