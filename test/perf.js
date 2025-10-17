import intersect from '../intersect.js';
import intersect2, { indexPath } from '../indexing.js';

/**
 * Needs to be implemented, probably a simple nested grid or a quad tree will do
 * @typedef {import('../indexing.js').SpatialIndex} Interface
 * @type {import('../indexing.js').SpatialIndex}
 * @implements {Interface}
 */
class SpatialIndex {
  /**
   *
   * @param {number} pathId
   * @param {number} curveIndex
   * @param {import('../intersect.js').PathComponent} curve
   * @param {import('../indexing.js').BBox} bbox
   */
  add(pathId, curveIndex, curve, bbox) {
    throw new Error('Method not implemented.');
  }

  /**
   *
   * @param {number} pathId
   */
  remove(pathId) {
    throw new Error('Method not implemented.');
  }

  /**
   *
   * @param {number[]} pathIds
   */
  intersect(pathIds) {
    throw new Error('Method not implemented.');
    return [];
  }
}

/**
 *
 * @param {number} n
 * @returns {import('../intersect.js').PathComponent[]}
 */
const createPath = (n) => {
  /**
   *
   * @param {'M'|'L'} cmd
   * @returns {import('../intersect.js').PathComponent}
   */
  const cmd = (cmd) => [
    cmd,
    Math.round(Math.random() * 800),
    Math.round(Math.random() * 800),
  ];
  return [cmd('M')].concat(new Array(n).fill(0).map(() => cmd('L')));
};

const a = createPath(5000);
const b = createPath(5000);

const index = new SpatialIndex();

// when

performance.mark('total');
performance.mark('index');
const id1 = indexPath(a, index);
const id2 = indexPath(b, index);
const mark0 = performance.measure(
  'indexing',
  { detail: { ids: [id1, id2] } },
  'index'
);
performance.mark('intersect2');
const intersections = intersect2([id1, id2], index).length;
const mark1 = performance.measure(
  'intersect',
  { detail: { intersections } },
  'intersect2'
);
const mark = performance.measure('intersect2 total', 'total');

console.log(mark0.toJSON(), mark1.toJSON(), mark.toJSON());

performance.mark('intersect');
const baseline = intersect(a, b, true);
const baselineMark = performance.measure(
  'baseline',
  { detail: { intersections: baseline } },
  'intersect'
);

console.log(baselineMark.toJSON());
