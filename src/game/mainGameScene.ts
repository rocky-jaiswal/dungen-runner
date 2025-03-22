import { Container, Ticker } from 'pixi.js';

import { GameState } from './gameState';
import { GameScene } from './types';
import { Player } from './player';
import { Walls } from './walls';
import { Spiders } from './spiders';
import { Ghosts } from './ghosts';

export class MainGameScene extends Container implements GameScene {
  private readonly gameState: GameState;

  public player: Player | null = null;
  public spiders: Spiders | null = null;
  public ghosts: Ghosts | null = null;

  constructor(gameState: GameState) {
    super();

    this.gameState = gameState;
  }

  public init() {
    new Walls(this.gameState).init();

    this.spiders = new Spiders(this.gameState);
    this.spiders.init();

    this.ghosts = new Ghosts(this.gameState);
    this.ghosts.init();

    this.player = new Player(this.gameState);
    this.player.init();
  }

  private endGame() {
    return this.gameState.keys['x'];
  }

  public update(_delta: Ticker) {
    if (!this.gameState.gameEnded) {
      if (this.endGame()) {
        this.gameState.eventEmitter.emit('gameEnded');
      }
      this.player?.update();
      this.spiders?.update();
      this.ghosts?.update();
    }
  }
}
