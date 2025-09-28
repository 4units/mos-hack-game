export type Cell = { x: number; y: number };

export type LevelFormat = {
  field_size: number; // NxN
  start_cell: Cell; // обязательный старт
  end_cell: Cell; // обязательный финиш
  order: Cell[]; // промежуточные якоря по порядку (можно пустой массив)
  blockers: Cell[]; // клетки-стены (крестики)
  answer?: number[][]; // опционально: эталон (не обязателен для игры)
};
