import { Component, OnInit } from '@angular/core';
import { GameBoard } from '../game-board';
import { GameState } from '../game-state';
import { MoveScore } from '../move-score';
import { GameResult } from '../game-result';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css']
})
export class MainGameComponent implements OnInit {

  highlightSpaces:boolean[][];
  gameBoard:GameBoard = new GameBoard();
  playerWins:number;
  computerWins:number;
  drawGames:number;
  currGame:GameState[];
  dataBaseList:GameState[];
  playerSide:number;
  computerSide:number;
  gameStarted:boolean;
  gameOver:boolean;
  processingMove:boolean;

  constructor() { }

  ngOnInit() {
    this.gameBoard.board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
    this.highlightSpaces = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]
    this.dataBaseList = [];
    this.currGame = [];
    this.playerWins = 0;
    this.computerWins = 0;
    this.drawGames = 0;
    this.gameStarted = false;
    this.gameOver = false;
    this.processingMove = false;
    // let count = 0;
    // while(count < 10) {

    //   let player = 1;
    //   let result = this.gameBoard.getResult();
    //   while(!result.gameOver) {
    //     let nextMove = this.getNextMove();
    //     let winMove = this.gameBoard.getWinMove();
    //     if(winMove) {
    //       this.makeMove(winMove, player);
    //     } else {
    //       this.makeMove(nextMove, player);
    //     }
    //     player = - player;
    //     result = this.gameBoard.getResult();
    //   }
    //   this.processEndGame(result);
    //   count++;
    // }
    // console.log(this.dataBaseList);
    

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

  playerMove(move:number[]) {
    if(this.gameOver) {
      return;
    }
    if(this.processingMove) {
      return;
    }
    this.makeMove(move, this.playerSide);
    if (this.gameStarted && !this.gameOver) {
      this.processingMove = true;
      setTimeout(() => {this.makeMove(this.getNextMove(), this.computerSide)}, 1000);
    }
  }
  saveGameResults(result:GameResult) {

    
    for(let i = 0; i < this.currGame.length; i++) {
      let checkBoard = new GameBoard();
      checkBoard.board = this.currGame[i].boardState;
      for(let j = 0; j < this.dataBaseList.length; j++) {
        if(checkBoard.isEqual(this.dataBaseList[j].boardState)) {
          for(let k = 0; k < this.dataBaseList[j].moveList.length; k++) {
            let checkMove = this.currGame[i].moveList[0].move;
            let dataMove = this.dataBaseList[j].moveList[k].move;
            // console.log(JSON.stringify(checkMove), JSON.stringify(dataMove));
            if(checkMove[0] == dataMove[0] && checkMove[1] == dataMove[1]) {
              if(this.currGame[i].moveList[0].score == result.winner) {
                this.dataBaseList[j].moveList[k].score++;
              } else if(result.winner == 0) {
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

  resetGame() {
    this.currGame = [];
    this.gameBoard.resetBoard();
    this.gameStarted = false;
    this.gameOver = false;
    this.highlightSpaces = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]
  }
  processEndGame(result:GameResult) {
    // console.log(result);
    if(result.winner == 0) {
      this.drawGames++;
    } else if(result.winner == this.playerSide) {
      this.playerWins++;
    } else {
      this.computerWins++;
    }
    if(result.winningSpaces) {

      for(let i = 0; i < result.winningSpaces.length; i++) {
        this.highlightSpaces[result.winningSpaces[i][0]][result.winningSpaces[i][1]] = true;
      }
    }
    this.saveGameResults(result);
    this.gameOver=true;
  }
  makeMove(theMove:number[], player:number){
    let currState:GameState = new GameState();
    currState.boardState = this.gameBoard.getCloneBoard();
    currState.moveList = [new MoveScore(theMove, player)];
    this.currGame.push(currState);
    this.gameBoard.board[theMove[0]][theMove[1]] = player;
    let result = this.gameBoard.getResult();
    this.processingMove = false;
    console.log(result);
    if (result.gameOver) {
      this.processEndGame(result);
    }
  }
  
  getNextMove():number[] {

    let currState:GameState;
    // console.log(JSON.stringify(currState));
    for(let i = 0; i < this.dataBaseList.length; i++) {
      if(this.gameBoard.isEqual(this.dataBaseList[i].boardState)) {
        currState = this.dataBaseList[i]
        break;
      }
    }
    // console.log("Found currState: " + JSON.stringify(currState));
    if(!currState){

      currState = new GameState();
      currState.boardState = this.gameBoard.getCloneBoard();
      currState.moveList = [];
      let movesList = this.gameBoard.getMoves();
      for(let i = 0; i < movesList.length; i++){
        currState.moveList.push(new MoveScore(movesList[i]));
      }
      this.dataBaseList.push(currState);
      // // console.log(JSON.stringify(this.dataBaseList));
    }
    let winMove = this.gameBoard.getWinMove(this.computerSide);
    if(winMove) {
      return winMove;
    }
    let highScore = currState.moveList[0].score;
    for(let i = 1; i < currState.moveList.length; i++){
      if(currState.moveList[i].score > highScore) {
        highScore = currState.moveList[i].score;
      }
    }
    let drawCount = Infinity;
    let possibleMoves:number[][] = [];
    for(let i = 0; i < currState.moveList.length; i++) {
      if(currState.moveList[i].score == highScore) {
        if(currState.moveList[i].drawCount < drawCount) {
          drawCount = currState.moveList[i].drawCount;
        }
      }
    }

    for(let i = 0; i < currState.moveList.length; i++) {
      if(currState.moveList[i].score == highScore) {
        if(currState.moveList[i].drawCount == drawCount) {
          possibleMoves.push(currState.moveList[i].move);
        }
      }
    }

    let pickrnd = Math.floor(Math.random() * possibleMoves.length);

    return possibleMoves[pickrnd];
  }
}
