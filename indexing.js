import { curveBBox, findBezierIntersections, parsePathCurve } from './intersect.js';

let indexKey = 0;

/**
 *
 * @param {import('./intersect').Path[]} path
 * @param {import('./indexing').SpatialIndex} index
 * @returns {number} index key
 */
export function indexPath(path, index) {
  const curve = parsePathCurve(path);

  const pathId = indexKey++;

  for (
    let curveIndex = 0, x1, y1, x1m, y1m, bez, pi;
    curveIndex < curve.length;
    curveIndex++
  ) {
    pi = curve[curveIndex];

    if (pi[0] == 'M') {
      x1 = x1m = pi[1];
      y1 = y1m = pi[2];
    } else {
      if (pi[0] == 'C') {
        bez = [ x1, y1, ...pi.slice(1) ];
        x1 = bez[6];
        y1 = bez[7];
      } else {
        bez = [ x1, y1, x1, y1, x1m, y1m, x1m, y1m ];
        x1 = x1m;
        y1 = y1m;
      }

      index.add(pathId, curveIndex, bez, curveBBox(...bez));
    }
  }

  return pathId;
}

/**
 *
 * @param {number[]} pathIds
 * @param {import('./indexing').SpatialIndex} index
 * @param {boolean} [justCount]
 */
export default function findIndexedPathIntersections(
    pathIds,
    index,
    justCount
) {
  let res = justCount ? 0 : [];

  index.intersect(pathIds).forEach(([ a, b ]) => {

    /**
     * @type {import('./indexing.js').Intersection[]}
     */
    const intr = findBezierIntersections(a.curve, b.curve, justCount);

    if (justCount) {
      res += intr;
    } else {
      for (var k = 0, kk = intr.length; k < kk; k++) {
        intr[k].id1 = a.pathId;
        intr[k].id2 = b.pathId;
        intr[k].segment1 = a.curveIndex;
        intr[k].segment2 = b.curveIndex;
        intr[k].bez1 = a.curve;
        intr[k].bez2 = b.curve;
      }

      res = res.concat(intr);
    }
  });

  return res;
}
