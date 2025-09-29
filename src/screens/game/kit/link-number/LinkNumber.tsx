import React, { useMemo, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Group, Shape } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Cell, LevelFormat } from './types';

type Props = {
  level: LevelFormat;
  cellWidth?: number;
  cellHeight?: number;
  cellGap?: number;
  padding?: number;
  cornerRadiusPx?: number;
};

// helpers
const k = (p: Cell) => `${p.x},${p.y}`;
const eq = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;
const manhattanAdj = (a: Cell, b: Cell) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;

const CorneredPath: React.FC<{
  points: { x: number; y: number }[];
  stroke: string;
  strokeWidth?: number;
  radius: number;
}> = ({ points, stroke, strokeWidth = 2, radius }) => {
  return (
    <Shape
      sceneFunc={(ctx, shape) => {
        if (!points || points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const next = points[i + 1];

          const vx1 = curr.x - prev.x;
          const vy1 = curr.y - prev.y;
          const vx2 = next.x - curr.x;
          const vy2 = next.y - curr.y;

          const len1 = Math.hypot(vx1, vy1);
          const len2 = Math.hypot(vx2, vy2);

          const cross = vx1 * vy2 - vy1 * vx2;
          const isCorner = Math.abs(cross) > 1e-6 && len1 > 0 && len2 > 0;

          if (isCorner) {
            const ux1 = vx1 / len1;
            const uy1 = vy1 / len1;
            const ux2 = vx2 / len2;
            const uy2 = vy2 / len2;

            const safeR = Math.max(0.01, Math.min(radius, len1 / 2, len2 / 2));

            const beforeX = curr.x - ux1 * safeR;
            const beforeY = curr.y - uy1 * safeR;
            const afterX = curr.x + ux2 * safeR;
            const afterY = curr.y + uy2 * safeR;

            ctx.lineTo(beforeX, beforeY);
            ctx.arcTo(curr.x, curr.y, afterX, afterY, safeR);
          } else {
            ctx.lineTo(curr.x, curr.y);
          }
        }

        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);

        ctx.strokeShape(shape);
      }}
      stroke={stroke}
      strokeWidth={strokeWidth}
      lineCap="round"
      lineJoin="round"
    />
  );
};

export const LinkNumber: React.FC<Props> = ({
  level,
  cellWidth = 57,
  cellHeight = 56,
  cellGap = 16,
  padding = 12,
  cornerRadiusPx,
}) => {
  const n = level.field_size;
  const stepX = cellWidth + cellGap;
  const stepY = cellHeight + cellGap;
  const size = {
    W: n * cellWidth + padding * 2 + (n - 1) * cellGap,
    H: n * cellHeight + padding * 2 + (n - 1) * cellGap,
  };

  const blockersSet = useMemo(() => new Set(level.blockers.map(k)), [level.blockers]);

  const anchors: Cell[] = useMemo(
    () => [level.start_cell, ...level.order, level.end_cell],
    [level.start_cell, level.order, level.end_cell]
  );

  const start = anchors[0];
  const end = anchors[anchors.length - 1];

  const inBounds = (p: Cell) => p.x >= 0 && p.y >= 0 && p.x < n && p.y < n;
  const isBlocked = (p: Cell) => blockersSet.has(k(p));

  const [path, setPath] = useState<Cell[]>([start]);
  const [lockedIndex, setLockedIndex] = useState(0);
  const draggingRef = useRef<boolean>(false);

  const visited = useMemo(() => new Set(path.map(k)), [path]);
  const freeCellsTotal = n * n - blockersSet.size;

  const toCell = (evt: KonvaEventObject<PointerEvent>): Cell => {
    const stage = evt.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!stage || !pos) {
      return path[path.length - 1];
    }
    const rawX = Math.floor((pos.x - padding) / stepX);
    const rawY = Math.floor((pos.y - padding) / stepY);
    const x = Math.min(Math.max(rawX, 0), n - 1);
    const y = Math.min(Math.max(rawY, 0), n - 1);
    return { x, y };
  };

  function step(next: Cell) {
    if (!inBounds(next) || isBlocked(next)) return;
    const last = path[path.length - 1];

    if (path.length >= 2 && eq(next, path[path.length - 2])) {
      setPath((p) => p.slice(0, -1));
      return;
    }

    if (!manhattanAdj(last, next)) return;
    if (visited.has(k(next))) return;

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

  const win =
    lockedIndex === anchors.length - 1 &&
    path.length === freeCellsTotal &&
    eq(path[path.length - 1], end);

  const points = useMemo(
    () =>
      path.map((p) => ({
        x: padding + p.x * stepX + cellWidth / 2,
        y: padding + p.y * stepY + cellHeight / 2,
      })),
    [path, padding, stepX, stepY, cellWidth, cellHeight]
  );

  const autoRadius = Math.min(cellWidth, cellHeight) / 4;
  const cornerR = Math.max(2, cornerRadiusPx ?? autoRadius);

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
          {/* 1) ЛИНИЯ — снизу */}
          {points.length >= 2 && (
            <CorneredPath points={points} stroke="#58FFFF" strokeWidth={2} radius={cornerR} />
          )}

          {/* 2) ЛАСТИК: стираем линию под видимыми клетками */}
          {Array.from({ length: n }).map((_, y) =>
            Array.from({ length: n }).map((__, x) => {
              const p: Cell = { x, y };
              const id = k(p);
              const anchorIdx = anchors.findIndex((a) => eq(a, p));
              const isFirstAnchor = anchorIdx === 0;
              const isLastAnchor = anchorIdx === anchors.length - 1;
              const showCellVisuals = !win || isFirstAnchor || isLastAnchor;

              if (!showCellVisuals) return null;

              return (
                <Group key={`eraser-${id}`} x={padding + x * stepX} y={padding + y * stepY}>
                  {/* destination-out «вырезает» пиксели линии под клеткой */}
                  <Rect
                    width={cellWidth}
                    height={cellHeight}
                    cornerRadius={10}
                    fill="#000" // любой непрозрачный цвет
                    globalCompositeOperation="destination-out"
                  />
                </Group>
              );
            })
          )}

          {/* 3) ВИЗУАЛЫ СЕТКИ — сверху (бордеры, блокеры, якоря) */}
          {Array.from({ length: n }).map((_, y) =>
            Array.from({ length: n }).map((__, x) => {
              const p: Cell = { x, y };
              const id = k(p);
              const isVisited = visited.has(id);
              const anchorIdx = anchors.findIndex((a) => eq(a, p));
              const isAnchor = anchorIdx >= 0;

              const isFirstAnchor = anchorIdx === 0;
              const isLastAnchor = anchorIdx === anchors.length - 1;
              const showCellVisuals = !win || isFirstAnchor || isLastAnchor;

              const borderColor = isVisited ? '#58FFFF' : '#6088E4';
              const anchorLabelFill = win
                ? '#58FFFF'
                : isFirstAnchor || isVisited
                  ? '#58FFFF'
                  : isLastAnchor
                    ? '#DD41DB'
                    : '#6088E4';

              return (
                <Group key={`cell-${id}`} x={padding + x * stepX} y={padding + y * stepY}>
                  {showCellVisuals && (
                    <Rect
                      width={cellWidth}
                      height={cellHeight}
                      cornerRadius={10}
                      stroke={isLastAnchor && !isVisited ? '#DD41DB' : borderColor}
                      strokeWidth={2}
                    />
                  )}

                  {showCellVisuals && blockersSet.has(id) && (
                    <Text
                      text="✕"
                      width={cellWidth}
                      height={cellHeight}
                      align="center"
                      verticalAlign="middle"
                      fontSize={36}
                      fontStyle="bold"
                      fontFamily="Halvar Breit"
                      fill="#6088E4"
                    />
                  )}

                  {isAnchor && showCellVisuals && (
                    <Group>
                      <Rect
                        width={Math.max(0, cellWidth - 14)}
                        height={Math.max(0, cellHeight - 14)}
                        x={7}
                        y={7}
                        cornerRadius={12}
                      />
                      <Text
                        text={String(anchorIdx + 1)}
                        width={cellWidth}
                        height={cellHeight}
                        align="center"
                        verticalAlign="middle"
                        fontStyle="bold"
                        fontFamily="Halvar Breit"
                        fontSize={36}
                        fill={anchorLabelFill}
                      />
                    </Group>
                  )}
                </Group>
              );
            })
          )}
        </Layer>
      )}

      {win && <h3 className="text-[var(--color-raspberry)]">Вы прошли!</h3>}
    </div>
  );
};
