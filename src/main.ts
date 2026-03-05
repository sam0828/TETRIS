import { Game } from './game'
import { Renderer } from './renderer'

// 初始化遊戲和渲染器
const game = new Game()
const renderer = new Renderer(game)

// 開始遊戲循環
renderer.start()
