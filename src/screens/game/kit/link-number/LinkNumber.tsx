import React, { useMemo, useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Text, Group } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Cell, LevelFormat } from './types';

type Props = {
  level: LevelFormat;
  cellSize?: number;
  padding?: number;
};

// helpers
const k = (p: Cell) => `${p.x},${p.y}`;
const eq = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;
const manhattanAdj = (a: Cell, b: Cell) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;

export const LinkNumber: React.FC<Props> = ({ level, cellSize = 76, padding = 12 }) => {
  const n = level.field_size;
  const size = { W: n * cellSize + padding * 2, H: n * cellSize + padding * 2 };

  const blockersSet = useMemo(() => new Set(level.blockers.map(k)), [level.blockers]);

  // формируем список якорей по порядку: 1..m
  const anchors: Cell[] = useMemo(
    () => [level.start_cell, ...level.order, level.end_cell],
    [level.start_cell, level.order, level.end_cell]
  );

  const start = anchors[0];
  const end = anchors[anchors.length - 1];

  const inBounds = (p: Cell) => p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
  const isBlocked = (p: Cell) => blockersSet.has(k(p));

  // состояние пути
  const [path, setPath] = useState<Cell[]>([start]);
  const [lockedIndex, setLockedIndex] = useState(0); // сколько якорей уже подтверждено (индекс в anchors)
  const draggingRef = useRef<boolean>(false);

  const visited = useMemo(() => new Set(path.map(k)), [path]);
  const freeCellsTotal = n * n - blockersSet.size;

  const toCell = (evt: KonvaEventObject<PointerEvent>): Cell => {
    const stage = evt.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!stage || !pos) {
      return path[path.length - 1];
    }

    const x = Math.floor((pos.x - padding) / cellSize);
    const y = Math.floor((pos.y - padding) / cellSize);
    return { x, y };
  };

  function step(next: Cell) {
    if (!inBounds(next) || isBlocked(next)) return;

    const last = path[path.length - 1];

    // backstep: возвращаемся на предыдущую клетку — срезаем хвост
    if (path.length >= 2 && eq(next, path[path.length - 2])) {
      setPath((p) => p.slice(0, -1));
      return;
    }

    if (!manhattanAdj(last, next)) return;
    if (visited.has(k(next))) return; // запрет на самопересечение

    // запрещаем наступать на будущие якоря, кроме "следующего по порядку"
    const nextAnchorIndex = lockedIndex + 1;
    const nextAnchor = anchors[nextAnchorIndex];
    const isNextAnchor = nextAnchor && eq(next, nextAnchor);

    const forbiddenFutureAnchors = anchors.slice(nextAnchorIndex + 1).map(k);

    if (forbiddenFutureAnchors.includes(k(next))) return;

    setPath((p) => [...p, next]);

    if (isNextAnchor) setLockedIndex(nextAnchorIndex);
  }

  function onPointerDown(e: KonvaEventObject<PointerEvent>) {
    const p = toCell(e);
    // стартуем с головы пути
    if (eq(p, path[path.length - 1])) draggingRef.current = true;
  }

  function onPointerMove(e: KonvaEventObject<PointerEvent>) {
    if (!draggingRef.current) return;
    const p = toCell(e);
    if (!eq(p, path[path.length - 1])) step(p);
  }

  function onPointerUp() {
    draggingRef.current = false;
  }

  // победа: подтверждён последний якорь и покрыты все свободные клетки
  const win =
    lockedIndex === anchors.length - 1 &&
    path.length === freeCellsTotal &&
    eq(path[path.length - 1], end);

  // polyline из центров клеток
  const poly = path.flatMap((p) => [
    padding + p.x * cellSize + cellSize / 2,
    padding + p.y * cellSize + cellSize / 2,
  ]);

  const stageProps = {
    width: size.W,
    height: size.H,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    pixelRatio: 1,
  } as React.ComponentProps<typeof Stage>;

  return (
    <div style={{ touchAction: 'none' }}>
      {React.createElement(
        Stage,
        stageProps,
        <Layer>
          {/* сетка */}
          {Array.from({ length: n }).map((_, y) =>
            Array.from({ length: n }).map((__, x) => {
              const p: Cell = { x, y };
              const id = k(p);
              const isVisited = visited.has(id);
              const anchorIdx = anchors.findIndex((a) => eq(a, p));
              const isAnchor = anchorIdx >= 0;

              return (
                <Group key={id} x={padding + x * cellSize} y={padding + y * cellSize}>
                  <Rect
                    width={cellSize}
                    height={cellSize}
                    cornerRadius={10}
                    stroke="#9fb5ff"
                    strokeWidth={1}
                    opacity={0.25}
                  />
                  {isVisited && (
                    <Rect width={cellSize} height={cellSize} cornerRadius={10} fill="#58ffff22" />
                  )}
                  {blockersSet.has(id) && (
                    <Text
                      text="✕"
                      width={cellSize}
                      height={cellSize}
                      align="center"
                      verticalAlign="middle"
                      fontSize={Math.floor(cellSize * 0.6)}
                      fill="#bdcefa"
                    />
                  )}
                  {isAnchor && (
                    <Group>
                      <Rect
                        width={cellSize - 14}
                        height={cellSize - 14}
                        x={7}
                        y={7}
                        cornerRadius={12}
                        fill={anchorIdx <= lockedIndex ? '#1919ef' : '#060698'}
                        shadowBlur={anchorIdx <= lockedIndex ? 10 : 0}
                      />
                      <Text
                        text={String(anchorIdx + 1)}
                        width={cellSize}
                        height={cellSize}
                        align="center"
                        verticalAlign="middle"
                        fontStyle="bold"
                        fontSize={Math.floor(cellSize * 0.5)}
                        fill="#dee1ee"
                      />
                    </Group>
                  )}
                </Group>
              );
            })
          )}

          {/* линия */}
          <Line
            points={poly}
            stroke="#58ffff"
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
            shadowBlur={8}
          />
        </Layer>
      )}

      {win && (
        <div style={{ marginTop: 10, color: '#3cffb9', fontWeight: 700 }}>✓ Уровень пройден!</div>
      )}
    </div>
  );
};
