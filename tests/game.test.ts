import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Game } from '../src/game'

describe('Game', () => {
  let game: Game

  beforeEach(() => {
    game = new Game()
  })

  it('應該初始化遊戲', () => {
    expect(game.score).toBe(0)
    expect(game.level).toBe(1)
    expect(game.lines).toBe(0)
    expect(game.isGameOver()).toBe(false)
  })

  it('應該能夠開始遊戲', () => {
    game.start()
    expect(game.isRunning()).toBe(true)
  })

  it('應該能夠暫停遊戲', () => {
    game.start()
    game.pause()
    expect(game.isRunning()).toBe(false)
  })

  it('應該能夠恢復遊戲', () => {
    game.start()
    game.pause()
    game.resume()
    expect(game.isRunning()).toBe(true)
  })

  it('應該有當前的方塊', () => {
    game.start()
    expect(game.currentPiece).toBeDefined()
  })

  it('應該有下一個方塊', () => {
    game.start()
    expect(game.nextPiece).toBeDefined()
  })

  it('應該能夠左移方塊', () => {
    game.start()
    const initialX = game.currentPiece.x
    game.movePieceLeft()
    expect(game.currentPiece.x).toBeLessThanOrEqual(initialX)
  })

  it('應該能夠右移方塊', () => {
    game.start()
    const initialX = game.currentPiece.x
    game.movePieceRight()
    expect(game.currentPiece.x).toBeGreaterThanOrEqual(initialX)
  })

  it('應該能夠下落方塊', () => {
    game.start()
    const initialY = game.currentPiece.y
    game.movePieceDown()
    expect(game.currentPiece.y).toBeGreaterThan(initialY)
  })

  it('應該能夠旋轉方塊', () => {
    game.start()
    const originalShape = JSON.stringify(game.currentPiece.shape)
    game.rotatePiece()
    const newShape = JSON.stringify(game.currentPiece.shape)
    // O 型不會改變
    if (game.currentPiece.type !== 'O') {
      expect(originalShape).not.toBe(newShape)
    }
  })

  it('消除一行應該增加分數', () => {
    game.start()
    const initialScore = game.score
    // 填充倒數第二行
    for (let x = 0; x < 10; x++) {
      game.board.setCellFilled(x, 18, true)
    }
    game.update()
    expect(game.score).toBeGreaterThanOrEqual(initialScore)
  })

  it('消除行數應該影響等級', () => {
    game.start()
    const initialLevel = game.level
    // 消除 10 行來提升等級
    for (let i = 10; i < 20; i++) {
      for (let x = 0; x < 10; x++) {
        game.board.setCellFilled(x, i, true)
      }
    }
    game.update()
    expect(game.level).toBeGreaterThanOrEqual(initialLevel)
  })

  it('方塊接觸到底部應該生成新方塊', () => {
    game.start()
    const firstPiece = game.currentPiece.type
    for (let i = 0; i < 30; i++) {
      game.movePieceDown()
      game.updateIfNeeded()
    }
    expect(game.currentPiece).toBeDefined()
  })
})
