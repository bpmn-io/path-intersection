
/**
 * Find or counts the intersections between two SVG paths.
 *
 * Returns a number in counting mode and a list of intersections otherwise.
 *
 * A single intersection entry contains the intersection coordinates (x, y)
 * as well as additional information regarding the intersecting segments
 * on each path (segment1, segment2) and the relative location of the
 * intersection on these segments (t1, t2).
 *
 * The path may be an SVG path string or an array of path components
 * such as `[ [ 'M', 0, 10 ], [ 'L', 20, 0 ] ]`.
 *
 * For performance optimization, pre-parsed paths can be passed directly,
 * {@link parsePath | the parsePath utility} can be used to pre-parse any path.
 *
 * @example
 *
 * import findPathIntersections from 'path-intersection';
 *
 * var intersections = findPathIntersections(
 *   'M0,0L100,100',
 *   [ [ 'M', 0, 100 ], [ 'L', 100, 0 ] ]
 * );
 *
 * // intersections = [
 * //   { x: 50, y: 50, segment1: 1, segment2: 1, t1: 0.5, t2: 0.5 }
 * // ];
 *
 * @param {Path} path1
 * @param {Path} path2
 * @param {boolean} [justCount=false]
 *
 * @return {Intersection[]|number}
 */
declare function findPathIntersections(path1: Path, path2: Path, justCount: true): number;
declare function findPathIntersections(path1: Path, path2: Path, justCount: false): Intersection[];
declare function findPathIntersections(path1: Path, path2: Path): Intersection[];
declare function findPathIntersections(path1: Path, path2: Path, justCount?: boolean): Intersection[] | number;

export default findPathIntersections;

/**
 * Parses a path to an optimized format. The result can be cached
 * and reused to maximize performance in subsequent intersection calculations.
 *
 * This is the recommended way to pre-parse paths for repeated use.
 * Paths parsed this way will not be re-parsed when passed to
 * {@link findPathIntersections | the intersect function}.
 *
 * @example
 *
 * import intersect, { parsePath } from 'path-intersection';
 *
 * // parse once
 * const path1 = parsePath('M0,0L100,100');
 * const path2 = parsePath('M0,100L100,0');
 *
 * // cache and reuse
 * const result1 = intersect(path1, parsedPath2);
 * const result2 = intersect(path2, parsedPath2);
 *
 * @param {Path} path - the path to parse
 *
 * @return {PathComponent[]} pre-parsed and optimized path
 */
export function parsePath(path: Path): PathComponent[];

/**
 * A SVG path string, or it's array encoded version.
 *
 * @example
 *
 * "M150,150m0,-18a18,18,0,1,1,0,36a18,18,0,1,1,0,-36z"
 *
 * @example
 *
 * [
 *   ['M', 1, 2],
 *   ['m', 0, -2],
 *   ['a', 1, 1, 0, 1, 1, 0, 2 * 1],
 *   ['a', 1, 1, 0, 1, 1, 0, -2 * 1],
 *   ['z']
 * ]
 */
declare type Path = string | PathComponent[];
/**
 * A SVG path component, stored as an array with the operation, and parameters.
 * 
 * @example
 *
 * ['M', 1, 2]
 */
declare type PathComponent = [ string, ...number[] ];

declare interface Intersection {
  /**
   * Segment of first path.
   */
  segment1: number;

  /**
   * Segment of first path.
   */
  segment2: number;

  /**
   * The x coordinate.
   */
  x: number;

  /**
   * The y coordinate.
   */
  y: number;

  /**
   * Bezier curve for matching path segment 1.
   */
  bez1: number[];

  /**
   * Bezier curve for matching path segment 2.
   */
  bez2: number[];

  /**
   * Relative position of intersection on path segment1 (0.5 => in middle, 0.0 => at start, 1.0 => at end).
   */
  t1: number;

  /**
   * Relative position of intersection on path segment2 (0.5 => in middle, 0.0 => at start, 1.0 => at end).
   */
  t2: number;
}

export type { Intersection, Path, PathComponent };
