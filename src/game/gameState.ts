import { Application, EventEmitter, Rectangle } from 'pixi.js';
import { Position } from './types';

interface Props {
  width: number;
  height: number;
  application: Application;
  eventEmitter: EventEmitter;
}

export class GameState {
  public readonly application: Application;
  public readonly eventEmitter: EventEmitter;

  public readonly width: number;
  public readonly height: number;

  public readonly gridSize = 50.0;

  public readonly noOfCols: number;
  public readonly noOfRows: number;

  public playerX: number;
  public playerY: number;
  public readonly playerSize: number = 12;

  public readonly walls: Position[] = [];

  public keys: { [key: string]: boolean } = {};
  public speed: number = 5;

  public gameEnded: boolean = false;
  public worldStopped: boolean = false;

  constructor(props: Props) {
    this.application = props.application;
    this.eventEmitter = props.eventEmitter;

    this.width = props.width;
    this.height = props.height;
    console.log({ w: this.width, h: this.height });

    this.noOfCols = Math.floor(this.width / this.gridSize);
    this.noOfRows = Math.floor(this.height / this.gridSize);

    this.playerX = this.gridSize * 1.5;
    this.playerY = this.gridSize * 1.5;

    this.assignWallPositions();

    this.eventEmitter.addListener('gameEnded', () => this.endGame());
  }

  private assignWallPositions() {
    for (let x = 0; x < this.noOfCols; x++) {
      for (let y = 0; y < this.noOfRows; y++) {
        // Create walls with some randomness and leave initial area clean
        if (Math.random() < 0.15 && x > 2 && y > 2) {
          const wall = { x: x * this.gridSize, y: y * this.gridSize };
          this.walls.push(wall);
        }
      }
    }
  }

  public checkWallCollision(x: number, y: number): boolean {
    const playerBounds = new Rectangle(
      x - this.playerSize,
      y - this.playerSize,
      this.playerSize * 2,
      this.playerSize * 2,
    ).getBounds();

    return this.walls.some((wall) => {
      const wallBounds = new Rectangle(wall.x, wall.y, this.gridSize, this.gridSize).getBounds();
      return playerBounds.intersects(wallBounds);
    });
  }

  private endGame() {
    this.gameEnded = true;
  }
}
