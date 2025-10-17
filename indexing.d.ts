import type { Path, PathComponent, Intersection as Intersection0 } from './intersect.d.ts';

export type Intersection = Intersection0 & {
  id1: number;
  id2: number;
};

export type BBox = { x0: number; y0: number; x1: number; y1: number };

export type IndexEntry = {
  pathId: number;
  curveIndex: number;
  curve: PathComponent;
};

export type IndexIntersection = [IndexEntry, IndexEntry];

export interface SpatialIndex {
  add(
    pathId: number,
    curveIndex: number,
    curve: PathComponent,
    bbox: BBox
  ): void;

  remove(pathId: number): void;

  intersect(pathIds: number[]): IndexIntersection[];
}

/**
 * Index {@link path} into {@link spatialIndex}
 * Must be called before {@link findPathIntersections}
 * @returns index key to pass to {@link findPathIntersections}
 */
export function indexPath(path: Path, spatialIndex: SpatialIndex): number;

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
 * The path may be an SVG path string or a list of path components
 * such as `[ [ 'M', 0, 10 ], [ 'L', 20, 0 ] ]`.
 *
 * Uses spatial indexing to boost performance.
 * If a path is not indexed the method will return no intersections.
 * @see {@link indexPath}
 *
 * @example
 *
 * const spatialIndex = new SpatialIndex();
 * const id1 = indexPath('M0,0L100,100', spatialIndex);
 * const id2 = indexPath([ [ 'M', 0, 100 ], [ 'L', 100, 0 ] ], spatialIndex);
 * const id3 = indexPath([ [ 'M', 0, 50 ], [ 'L', 100, 50 ] ], spatialIndex);
 *
 * const intersections = findPathIntersections(id1, id2, spatialIndex, false);
 * const intersections2 = findPathIntersections(id1, id3, spatialIndex, false);
 *
 * // intersections = [
 * //   { x: 50, y: 50, segment1: 1, segment2: 1, t1: 0.5, t2: 0.5 }
 * // ];
 * // intersections2 = [
 * //   { x: 50, y: 50, segment1: 1, segment2: 1, t1: 0.5, t2: 0.5 }
 * // ];
 */
declare function findPathIntersections(
  pathIds: number[],
  index: SpatialIndex,
  justCount: true
): number;
declare function findPathIntersections(
  pathIds: number[],
  index: SpatialIndex,
  justCount: false
): Intersection[];
declare function findPathIntersections(
  pathIds: number[],
  index: SpatialIndex
): Intersection[];
declare function findPathIntersections(
  pathIds: number[],
  index: SpatialIndex,
  justCount?: boolean
): Intersection[] | number;

export default findPathIntersections;
