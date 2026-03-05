/**
 * 棋盤類 - 管理遊戲棋盤的狀態
 */
export class Board {
  private grid: boolean[][]

  constructor(
    readonly width: number,
    readonly height: number
  ) {
    this.grid = Array(height)
      .fill(null)
      .map(() => Array(width).fill(false))
  }

  /**
   * 檢查指定位置的單元格是否已填充
   */
  isCellFilled(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return true // 邊界視為已填充
    }
    return this.grid[y][x]
  }

  /**
   * 設置指定位置的單元格填充狀態
   */
  setCellFilled(x: number, y: number, filled: boolean): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x] = filled
    }
  }

  /**
   * 檢查棋盤是否為空
   */
  isEmpty(): boolean {
    return this.grid.every(row => row.every(cell => !cell))
  }

  /**
   * 檢查指定行是否已滿
   */
  isLineFull(y: number): boolean {
    if (y < 0 || y >= this.height) return false
    return this.grid[y].every(cell => cell)
  }

  /**
   * 清除指定行
   */
  clearLine(y: number): void {
    if (y < 0 || y >= this.height) return
    // 將該行上面的行全部下移
    for (let i = y; i > 0; i--) {
      this.grid[i] = [...this.grid[i - 1]]
    }
    // 最上面一行設為空
    this.grid[0] = Array(this.width).fill(false)
  }

  /**
   * 清除所有完整的行，返回清除的行數
   */
  clearFullLines(): number {
    let clearedLines = 0
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.isLineFull(y)) {
        this.clearLine(y)
        clearedLines++
        y++ // 因為行已經下移，需要重新檢查這一行
      }
    }
    return clearedLines
  }

  /**
   * 檢查是否遊戲結束（方塊堆到頂部）
   */
  isGameOver(): boolean {
    // 檢查最上面的幾行是否有填充的單元格
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x]) {
          return true
        }
      }
    }
    return false
  }

  /**
   * 獲得棋盤網格的副本
   */
  getGrid(): boolean[][] {
    return this.grid.map(row => [...row])
  }

  /**
   * 清空棋盤
   */
  clear(): void {
    this.grid = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(false))
  }
}
