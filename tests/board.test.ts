import { describe, it, expect, beforeEach } from 'vitest'
import { Board } from '../src/board'

describe('Board', () => {
  let board: Board

  beforeEach(() => {
    board = new Board(10, 20)
  })

  it('應該初始化一個空的棋盤', () => {
    expect(board.width).toBe(10)
    expect(board.height).toBe(20)
    expect(board.isEmpty()).toBe(true)
  })

  it('應該能夠放置一個方塊', () => {
    board.setCellFilled(0, 0, true)
    expect(board.isCellFilled(0, 0)).toBe(true)
  })

  it('應該能夠清除一個方塊', () => {
    board.setCellFilled(0, 0, true)
    board.setCellFilled(0, 0, false)
    expect(board.isCellFilled(0, 0)).toBe(false)
  })

  it('應該能夠檢測是否有完整的一行', () => {
    for (let x = 0; x < 10; x++) {
      board.setCellFilled(x, 0, true)
    }
    expect(board.isLineFull(0)).toBe(true)
    expect(board.isLineFull(1)).toBe(false)
  })

  it('應該能夠清除完整的一行', () => {
    for (let x = 0; x < 10; x++) {
      board.setCellFilled(x, 0, true)
    }
    board.clearLine(0)
    expect(board.isLineFull(0)).toBe(false)
  })

  it('應該能夠清除多個完整的行', () => {
    for (let x = 0; x < 10; x++) {
      board.setCellFilled(x, 0, true)
      board.setCellFilled(x, 1, true)
    }
    const clearedLines = board.clearFullLines()
    expect(clearedLines).toBe(2)
  })

  it('應該能夠檢測是否超過高度', () => {
    // 在頂部填充方塊表示遊戲結束
    for (let x = 0; x < 10; x++) {
      board.setCellFilled(x, 1, true)
    }
    expect(board.isGameOver()).toBe(true)
  })

  it('應該能夠獲得棋盤狀態', () => {
    board.setCellFilled(5, 5, true)
    const grid = board.getGrid()
    expect(grid[5][5]).toBe(true)
    expect(grid[0][0]).toBe(false)
  })
})
