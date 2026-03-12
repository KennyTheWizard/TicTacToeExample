import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBoard } from '../game-board';
import { GameState } from '../game-state';
import { MoveScore } from '../move-score';
import { GameResult } from '../game-result';

@Component({
  selector: 'app-main-game',
  imports: [CommonModule],
  templateUrl: './main-game.component.html',
  styleUrl: './main-game.component.css'
})
export class MainGameComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  winnerMessage = '';
  highlightSpaces: boolean[][] = [];
  gameBoard: GameBoard = new GameBoard();
  playerWins = 0;
  computerWins = 0;
  drawGames = 0;
  currGame: GameState[] = [];
  dataBaseList: GameState[] = [];
  playerSide = 0;
  computerSide = 0;
  gameStarted = false;
  gameOver = false;
  processingMove = false;

  ngOnInit() {
    this.gameBoard.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.highlightSpaces = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
    this.dataBaseList = [];
    this.currGame = [];
    this.playerWins = 0;
    this.computerWins = 0;
    this.drawGames = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.processingMove = false;
  }

  startGameAsX() {
    this.gameStarted = true;
    this.playerSide = 1;
    this.computerSide = -1;
  }

  startGameAsO() {
    this.gameStarted = true;
    this.playerSide = -1;
    this.computerSide = 1;
    this.makeMove(this.getNextMove(), this.computerSide);
  }

  async playerMove(move: number[]) {
    if (this.gameOver || this.processingMove) {
      return;
    }
    this.getNextMove();
    this.makeMove(move, this.playerSide);
    if (this.gameStarted && !this.gameOver) {
      this.processingMove = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.makeMove(this.getNextMove(), this.computerSide);
      this.cdr.markForCheck();
    }
  }

  saveGameResults(result: GameResult) {
    for (let i = 0; i < this.currGame.length; i++) {
      const checkBoard = new GameBoard();
      checkBoard.board = this.currGame[i].boardState;
      for (let j = 0; j < this.dataBaseList.length; j++) {
        if (checkBoard.isEqual(this.dataBaseList[j].boardState)) {
          for (let k = 0; k < this.dataBaseList[j].moveList.length; k++) {
            const checkMove = this.currGame[i].moveList[0].move;
            const dataMove = this.dataBaseList[j].moveList[k].move;
            if (checkMove[0] == dataMove[0] && checkMove[1] == dataMove[1]) {
              if (this.currGame[i].moveList[0].score == result.winner) {
                this.dataBaseList[j].moveList[k].score++;
              } else if (result.winner == 0) {
                this.dataBaseList[j].moveList[k].drawCount++;
              } else {
                this.dataBaseList[j].moveList[k].score--;
              }
            }
          }
        }
      }
    }
  }

  resetWinnerMessage() {
    this.winnerMessage = '';
  }

  resetGame() {
    this.currGame = [];
    this.gameBoard.resetBoard();
    this.gameStarted = false;
    this.gameOver = false;
    this.highlightSpaces = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];
  }

  processEndGame(result: GameResult) {
    if (result.winner == 0) {
      this.drawGames++;
      this.winnerMessage = 'Draw!';
    } else if (result.winner == this.playerSide) {
      this.playerWins++;
      this.winnerMessage = 'You Won!';
    } else {
      this.computerWins++;
      this.winnerMessage = 'Try Again!';
    }
    if (result.winningSpaces) {
      for (let i = 0; i < result.winningSpaces.length; i++) {
        this.highlightSpaces[result.winningSpaces[i][0]][result.winningSpaces[i][1]] = true;
      }
    }
    this.saveGameResults(result);
    this.gameOver = true;
  }

  makeMove(theMove: number[], player: number) {
    const currState = new GameState();
    currState.boardState = this.gameBoard.getCloneBoard();
    currState.moveList = [new MoveScore(theMove, player)];
    this.currGame.push(currState);
    this.gameBoard.board[theMove[0]][theMove[1]] = player;
    const result = this.gameBoard.getResult();
    this.processingMove = false;
    if (result.gameOver) {
      this.processEndGame(result);
    }
  }

  getNextMove(): number[] {
    let currState: GameState | undefined;

    for (let i = 0; i < this.dataBaseList.length; i++) {
      if (this.gameBoard.isEqual(this.dataBaseList[i].boardState)) {
        currState = this.dataBaseList[i];
        break;
      }
    }

    if (!currState) {
      currState = new GameState();
      currState.boardState = this.gameBoard.getCloneBoard();
      currState.moveList = [];
      const movesList = this.gameBoard.getMoves();
      for (let i = 0; i < movesList.length; i++) {
        currState.moveList.push(new MoveScore(movesList[i]));
      }
      this.dataBaseList.push(currState);
    }

    const winMove = this.gameBoard.getWinMove(this.computerSide);
    if (winMove) {
      return winMove;
    }

    let highScore = currState.moveList[0].score;
    for (let i = 1; i < currState.moveList.length; i++) {
      if (currState.moveList[i].score > highScore) {
        highScore = currState.moveList[i].score;
      }
    }

    let drawCount = Infinity;
    const possibleMoves: number[][] = [];
    for (let i = 0; i < currState.moveList.length; i++) {
      if (currState.moveList[i].score == highScore) {
        if (currState.moveList[i].drawCount < drawCount) {
          drawCount = currState.moveList[i].drawCount;
        }
      }
    }

    for (let i = 0; i < currState.moveList.length; i++) {
      if (currState.moveList[i].score == highScore) {
        if (currState.moveList[i].drawCount == drawCount) {
          possibleMoves.push(currState.moveList[i].move);
        }
      }
    }

    const pickrnd = Math.floor(Math.random() * possibleMoves.length);
    return possibleMoves[pickrnd];
  }
}
