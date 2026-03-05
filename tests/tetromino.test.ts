import { describe, it, expect, beforeEach } from 'vitest'
import { Tetromino, TetrominoType } from '../src/tetromino'

describe('Tetromino', () => {
  it('應該能夠創建各種形狀的俄羅斯方塊', () => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'L', 'J']
    types.forEach(type => {
      const tetromino = new Tetromino(type)
      expect(tetromino.type).toBe(type)
      expect(tetromino.shape).toBeDefined()
      expect(tetromino.shape.length).toBeGreaterThan(0)
    })
  })

  it('應該能夠旋轉方塊', () => {
    const tetromino = new Tetromino('T')
    const originalShape = tetromino.shape
    tetromino.rotate()
    const rotatedShape = tetromino.shape
    // 排除 O 型（正方形不需要旋轉）
    if (tetromino.type !== 'O') {
      expect(JSON.stringify(originalShape)).not.toBe(JSON.stringify(rotatedShape))
    }
  })

  it('應該能夠獲得方塊的坐標', () => {
    const tetromino = new Tetromino('T')
    tetromino.x = 5
    tetromino.y = 10
    expect(tetromino.x).toBe(5)
    expect(tetromino.y).toBe(10)
  })

  it('應該能夠獲得絕對坐標', () => {
    const tetromino = new Tetromino('I')
    tetromino.x = 3
    tetromino.y = 2
    const blocks = tetromino.getAbsoluteCoordinates()
    blocks.forEach(([x, y]) => {
      expect(x).toBeGreaterThanOrEqual(tetromino.x)
      expect(y).toBeGreaterThanOrEqual(tetromino.y)
    })
  })

  it('I 方塊應該有正確的形狀', () => {
    const tetromino = new Tetromino('I')
    expect(tetromino.shape[0].length).toBe(4)
  })

  it('O 方塊應該有正確的形狀', () => {
    const tetromino = new Tetromino('O')
    expect(tetromino.shape[0].length).toBe(2)
    expect(tetromino.shape.length).toBe(2)
  })
})
