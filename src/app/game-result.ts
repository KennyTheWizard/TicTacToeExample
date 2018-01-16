export class GameResult {
    // true if game is over, false if game is not over
    gameOver:boolean;
    // 3 x 2 array with indexes of winning spaces
    winningSpaces:number[][];
    // x = 1 draw = 0 o = -1
    winner:number;

    constructor(gameOver:boolean, winningSpaces:number[][], winner:number) {
        this.gameOver = gameOver;
        this.winningSpaces = winningSpaces;
        this.winner = winner;
    }
}
