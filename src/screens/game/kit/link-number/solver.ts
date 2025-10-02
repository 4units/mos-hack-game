import type { Cell, LevelFormat } from './types';

const DIRECTIONS: Array<{ dx: number; dy: number }> = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

const key = (cell: Cell): string => `${cell.x},${cell.y}`;

const equals = (a: Cell, b: Cell): boolean => a.x === b.x && a.y === b.y;

const distance = (a: Cell, b: Cell): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const bfsReachable = (
  start: Cell,
  target: Cell,
  n: number,
  blockers: Set<string>,
  visited: Set<string>
): boolean => {
  if (equals(start, target)) return true;
  const queue: Cell[] = [start];
  const seen = new Set<string>([key(start)]);

  while (queue.length) {
    const current = queue.shift()!;

    for (const { dx, dy } of DIRECTIONS) {
      const next: Cell = { x: current.x + dx, y: current.y + dy };
      const nextKey = key(next);
      if (
        next.x < 0 ||
        next.y < 0 ||
        next.x >= n ||
        next.y >= n ||
        blockers.has(nextKey) ||
        visited.has(nextKey) ||
        seen.has(nextKey)
      ) {
        continue;
      }
      if (equals(next, target)) return true;
      seen.add(nextKey);
      queue.push(next);
    }
  }

  return false;
};

export const solveLinkNumberLevel = (level: LevelFormat): Cell[] | null => {
  const n = level.field_size;
  const blockers = new Set(level.blockers.map(key));
  const anchors: Cell[] = [level.start_cell, ...level.order, level.end_cell];
  const totalCells = n * n - blockers.size;

  const anchorIndexByKey = new Map<string, number>(
    anchors.map((cell, index) => [key(cell), index])
  );
  const visited = new Set<string>([key(level.start_cell)]);
  const path: Cell[] = [level.start_cell];

  const dfs = (currentAnchorIndex: number): boolean => {
    if (path.length === totalCells) {
      const last = path[path.length - 1];
      return currentAnchorIndex === anchors.length - 1 && equals(last, anchors[currentAnchorIndex]);
    }

    const current = path[path.length - 1];
    const nextAnchor = anchors[currentAnchorIndex + 1];

    const neighbors = DIRECTIONS.map(({ dx, dy }) => ({ x: current.x + dx, y: current.y + dy }))
      .filter((candidate) => {
        const candidateKey = key(candidate);
        if (
          candidate.x < 0 ||
          candidate.y < 0 ||
          candidate.x >= n ||
          candidate.y >= n ||
          blockers.has(candidateKey) ||
          visited.has(candidateKey)
        ) {
          return false;
        }

        const anchorIdx = anchorIndexByKey.get(candidateKey);
        if (anchorIdx !== undefined && anchorIdx > currentAnchorIndex + 1) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (!nextAnchor) return 0;
        return distance(a, nextAnchor) - distance(b, nextAnchor);
      });

    for (const candidate of neighbors) {
      const candidateKey = key(candidate);
      const anchorIdx = anchorIndexByKey.get(candidateKey);
      const nextAnchorIndex =
        anchorIdx !== undefined && anchorIdx === currentAnchorIndex + 1
          ? currentAnchorIndex + 1
          : currentAnchorIndex;

      if (nextAnchor && anchorIdx === undefined) {
        if (!bfsReachable(candidate, nextAnchor, n, blockers, visited)) {
          continue;
        }
      }

      visited.add(candidateKey);
      path.push(candidate);

      if (dfs(nextAnchorIndex)) {
        return true;
      }

      path.pop();
      visited.delete(candidateKey);
    }

    return false;
  };

  const solved = dfs(0);
  return solved ? [...path] : null;
};

export default solveLinkNumberLevel;
