export class GameResult {
    gameOver: boolean;
    winningSpaces: number[][] | undefined;
    winner: number | undefined;

    constructor(gameOver: boolean, winningSpaces: number[][] | undefined, winner: number | undefined) {
        this.gameOver = gameOver;
        this.winningSpaces = winningSpaces;
        this.winner = winner;
    }
}
