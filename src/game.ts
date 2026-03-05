import { Board } from './board'
import { Tetromino, generateRandomTetromino } from './tetromino'

/**
 * 遊戲引擎類
 */
export class Game {
  board: Board
  currentPiece: Tetromino
  nextPiece: Tetromino
  score = 0
  lines = 0
  level = 1
  private running = false
  private paused = false
  private dropCounter = 0
  private dropInterval = 1000 // 毫秒

  constructor() {
    this.board = new Board(10, 20)
    this.currentPiece = generateRandomTetromino()
    this.nextPiece = generateRandomTetromino()
  }

  /**
   * 開始遊戲
   */
  start(): void {
    this.running = true
    this.paused = false
  }

  /**
   * 暫停遊戲
   */
  pause(): void {
    this.paused = true
  }

  /**
   * 恢復遊戲
   */
  resume(): void {
    this.paused = false
  }

  /**
   * 檢查遊戲是否正在運行
   */
  isRunning(): boolean {
    return this.running && !this.paused
  }

  /**
   * 檢查遊戲是否結束
   */
  isGameOver(): boolean {
    return this.board.isGameOver()
  }

  /**
   * 左移方塊
   */
  movePieceLeft(): void {
    if (!this.isRunning()) return
    const newX = this.currentPiece.x - 1
    if (this.canMoveTo(newX, this.currentPiece.y, this.currentPiece.shape)) {
      this.currentPiece.x = newX
    }
  }

  /**
   * 右移方塊
   */
  movePieceRight(): void {
    if (!this.isRunning()) return
    const newX = this.currentPiece.x + 1
    if (this.canMoveTo(newX, this.currentPiece.y, this.currentPiece.shape)) {
      this.currentPiece.x = newX
    }
  }

  /**
   * 下落方塊
   */
  movePieceDown(): void {
    const newY = this.currentPiece.y + 1
    if (this.canMoveTo(this.currentPiece.x, newY, this.currentPiece.shape)) {
      this.currentPiece.y = newY
      return
    }
    // 無法下落，鎖定當前方塊
    this.lockPiece()
  }

  /**
   * 快速下落
   */
  hardDrop(): void {
    if (!this.isRunning()) return
    while (this.canMoveTo(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
      this.currentPiece.y++
    }
    this.lockPiece()
  }

  /**
   * 旋轉方塊
   */
  rotatePiece(): void {
    if (!this.isRunning()) return
    const originalShape = this.currentPiece.shape.map(row => [...row])
    this.currentPiece.rotate()

    // 檢查旋轉後是否超出邊界
    if (!this.canMoveTo(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
      // 嘗試向左或向右獲得合法位置
      if (
        this.canMoveTo(this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.shape)
      ) {
        this.currentPiece.x--
      } else if (
        this.canMoveTo(this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.shape)
      ) {
        this.currentPiece.x++
      } else {
        // 無法找到合法位置，撤銷旋轉
        this.currentPiece.shape = originalShape
      }
    }
  }

  /**
   * 檢查方塊是否可以移動到指定位置
   */
  private canMoveTo(x: number, y: number, shape: boolean[][]): boolean {
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[dy].length; dx++) {
        if (shape[dy][dx]) {
          const boardX = x + dx
          const boardY = y + dy

          // 檢查邊界
          if (boardX < 0 || boardX >= this.board.width || boardY >= this.board.height) {
            return false
          }

          // 檢查是否與已放置的方塊碰撞
          if (boardY >= 0 && this.board.isCellFilled(boardX, boardY)) {
            return false
          }
        }
      }
    }
    return true
  }

  /**
   * 鎖定當前方塊（放到棋盤上）
   */
  private lockPiece(): void {
    // 將方塊的所有部分添加到棋盤
    for (let dy = 0; dy < this.currentPiece.shape.length; dy++) {
      for (let dx = 0; dx < this.currentPiece.shape[dy].length; dx++) {
        if (this.currentPiece.shape[dy][dx]) {
          const x = this.currentPiece.x + dx
          const y = this.currentPiece.y + dy
          if (y >= 0) {
            this.board.setCellFilled(x, y, true)
          }
        }
      }
    }

    // 清除完整的行
    const clearedLines = this.board.clearFullLines()
    if (clearedLines > 0) {
      this.addScore(clearedLines)
    }

    // 生成新方塊
    this.currentPiece = this.nextPiece
    this.nextPiece = generateRandomTetromino()

    // 檢查遊戲是否結束
    if (!this.canMoveTo(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
      this.running = false
    }
  }

  /**
   * 添加分數
   */
  private addScore(clearedLines: number): void {
    const baseScores = [0, 40, 100, 300, 1200]
    const score = baseScores[clearedLines] * (this.level + 1)
    this.score += score
    this.lines += clearedLines

    // 更新等級
    const newLevel = Math.floor(this.lines / 10) + 1
    if (newLevel > this.level) {
      this.level = newLevel
      this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 50)
    }
  }

  /**
   * 更新遊戲狀態
   */
  update(deltaTime: number = 0): void {
    if (!this.isRunning()) return

    this.dropCounter += deltaTime
    if (this.dropCounter >= this.dropInterval) {
      this.movePieceDown()
      this.dropCounter = 0
    }
  }

  /**
   * 如果需要，更新遊戲狀態（用於測試）
   */
  updateIfNeeded(): void {
    this.update(this.dropInterval)
  }
}
