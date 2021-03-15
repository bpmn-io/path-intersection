# path-intersection

[![CI](https://github.com/bpmn-io/path-intersection/workflows/CI/badge.svg)](https://github.com/bpmn-io/path-intersection/actions?query=workflow%3ACI)

Computes the intersection between two SVG paths.


## Examples

<img width="600" src="https://raw.githubusercontent.com/bpmn-io/path-intersection/master/resources/examples.png" alt="Intersection examples" />

Execute `npm run dev` and navigate to [`http://localhost:9876/debug.html`](http://localhost:9876/debug.html) to see more examples.


## Usage

```javascript
var intersect = require('path-intersection');

var path0 = 'M30,100L270,20';
var path1 = 'M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z';

var intersection = intersect(path0, path1);
// [ { x: ..., y: ..., segment1: ..., segment2: ... }, ... ]
```

Results are approximate, as we use [bezier clipping](https://math.stackexchange.com/questions/118937) to find intersections.


## Building the Project

Perform a full build of the library (lint + test) via

```
npm run all
```


## Credits

The intersection logic provided by this library is derived from [`path.js`](https://github.com/adobe-webplatform/Snap.svg/blob/master/src/path.js), a part of [Snap.svg](https://github.com/adobe-webplatform/Snap.svg).


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).
