/**
 * 俄羅斯方塊類型定義
 */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'L' | 'J'

/**
 * 俄羅斯方塊形狀定義
 */
const SHAPES: Record<TetrominoType, boolean[][]> = {
  I: [[true, true, true, true]],
  O: [
    [true, true],
    [true, true],
  ],
  T: [
    [false, true, false],
    [true, true, true],
  ],
  S: [
    [false, true, true],
    [true, true, false],
  ],
  Z: [
    [true, true, false],
    [false, true, true],
  ],
  L: [
    [true, false],
    [true, false],
    [true, true],
  ],
  J: [
    [false, true],
    [false, true],
    [true, true],
  ],
}

/**
 * 俄羅斯方塊類
 */
export class Tetromino {
  shape: boolean[][]
  x = 3
  y = 0
  rotationIndex = 0

  constructor(readonly type: TetrominoType) {
    this.shape = this.cloneShape(SHAPES[type])
  }

  /**
   * 複製形狀
   */
  private cloneShape(shape: boolean[][]): boolean[][] {
    return shape.map(row => [...row])
  }

  /**
   * 旋轉方塊（順時針）
   */
  rotate(): void {
    if (this.type === 'O') return // 正方形不需要旋轉

    const newShape: boolean[][] = []
    const rows = this.shape.length
    const cols = this.shape[0].length

    for (let x = 0; x < cols; x++) {
      const newRow: boolean[] = []
      for (let y = rows - 1; y >= 0; y--) {
        newRow.push(this.shape[y][x])
      }
      newShape.push(newRow)
    }

    this.shape = newShape
    this.rotationIndex = (this.rotationIndex + 1) % 4
  }

  /**
   * 獲得方塊的所有絕對坐標
   */
  getAbsoluteCoordinates(): [number, number][] {
    const coordinates: [number, number][] = []
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x]) {
          coordinates.push([this.x + x, this.y + y])
        }
      }
    }
    return coordinates
  }

  /**
   * 獲得方塊的寬度
   */
  getWidth(): number {
    return this.shape[0].length
  }

  /**
   * 獲得方塊的高度
   */
  getHeight(): number {
    return this.shape.length
  }
}

/**
 * 生成隨機的俄羅斯方塊
 */
export function generateRandomTetromino(): Tetromino {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'L', 'J']
  const randomType = types[Math.floor(Math.random() * types.length)]
  return new Tetromino(randomType)
}
