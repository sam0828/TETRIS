import { Game } from './game'

/**
 * 遊戲渲染器
 */
export class Renderer {
  private gameBoard: HTMLElement
  private scoreDisplay: HTMLElement
  private linesDisplay: HTMLElement
  private levelDisplay: HTMLElement
  private startBtn: HTMLElement
  private pauseBtn: HTMLElement
  private game: Game

  constructor(game: Game) {
    this.game = game
    this.gameBoard = document.getElementById('game-board')!
    this.scoreDisplay = document.getElementById('score')!
    this.linesDisplay = document.getElementById('lines')!
    this.levelDisplay = document.getElementById('level')!
    this.startBtn = document.getElementById('start-btn')!
    this.pauseBtn = document.getElementById('pause-btn')!

    this.initializeBoard()
    this.attachEventListeners()
  }

  /**
   * 初始化棋盤 UI
   */
  private initializeBoard(): void {
    this.gameBoard.innerHTML = ''
    for (let i = 0; i < this.game.board.width * this.game.board.height; i++) {
      const cell = document.createElement('div')
      cell.className = 'cell'
      cell.dataset.index = String(i)
      this.gameBoard.appendChild(cell)
    }
  }

  /**
   * 添加事件監聽器
   */
  private attachEventListeners(): void {
    // 按鈕事件
    this.startBtn.addEventListener('click', () => {
      if (!this.game.isRunning()) {
        this.game.start()
        this.updateButtonStates()
      }
    })

    this.pauseBtn.addEventListener('click', () => {
      if (this.game.isRunning()) {
        this.game.pause()
      } else if (this.game.isGameOver()) {
        // 遊戲結束，重新開始
        this.game = new Game()
        this.game.start()
      } else {
        // 恢復遊戲
        this.game.resume()
      }
      this.updateButtonStates()
    })

    // 鍵盤事件
    document.addEventListener('keydown', (e) => {
      if (!this.game.isRunning()) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          this.game.movePieceLeft()
          break
        case 'ArrowRight':
          e.preventDefault()
          this.game.movePieceRight()
          break
        case 'ArrowDown':
          e.preventDefault()
          this.game.movePieceDown()
          break
        case 'ArrowUp':
          e.preventDefault()
          this.game.rotatePiece()
          break
        case ' ':
          e.preventDefault()
          this.game.hardDrop()
          break
      }
      this.render()
    })
  }

  /**
   * 更新按鈕狀態
   */
  private updateButtonStates(): void {
    if (this.game.isGameOver()) {
      this.startBtn.textContent = '重新開始'
      this.pauseBtn.textContent = '結束'
    } else if (this.game.isRunning()) {
      this.startBtn.textContent = '開始'
      this.pauseBtn.textContent = '暫停'
    } else {
      this.startBtn.textContent = '開始'
      this.pauseBtn.textContent = '繼續'
    }
  }

  /**
   * 遊戲循環
   */
  start(): void {
    let lastTime = Date.now()

    const gameLoop = () => {
      const now = Date.now()
      const deltaTime = now - lastTime
      lastTime = now

      this.game.update(deltaTime)
      this.render()

      if (this.game.isGameOver()) {
        this.pauseBtn.textContent = '重新開始'
      }

      requestAnimationFrame(gameLoop)
    }

    requestAnimationFrame(gameLoop)
  }

  /**
   * 渲染遊戲狀態
   */
  render(): void {
    // 更新棋盤
    const grid = this.game.board.getGrid()
    const cells = Array.from(this.gameBoard.querySelectorAll('.cell')) as HTMLElement[]

    // 清空棋盤
    cells.forEach(cell => cell.classList.remove('filled'))

    // 重繪棋盤
    for (let y = 0; y < this.game.board.height; y++) {
      for (let x = 0; x < this.game.board.width; x++) {
        if (grid[y][x]) {
          const index = y * this.game.board.width + x
          cells[index].classList.add('filled')
        }
      }
    }

    // 繪製當前方塊
    const coordinates = this.game.currentPiece.getAbsoluteCoordinates()
    for (const [x, y] of coordinates) {
      if (y >= 0 && y < this.game.board.height && x >= 0 && x < this.game.board.width) {
        const index = y * this.game.board.width + x
        cells[index].classList.add('filled')
      }
    }

    // 更新分數、行數、等級
    this.scoreDisplay.textContent = String(this.game.score)
    this.linesDisplay.textContent = String(this.game.lines)
    this.levelDisplay.textContent = String(this.game.level)

    // 更新按鈕狀態
    if (this.game.isGameOver()) {
      this.pauseBtn.textContent = '重新開始'
      this.startBtn.textContent = '重新開始'
    } else {
      this.updateButtonStates()
    }
  }
}
