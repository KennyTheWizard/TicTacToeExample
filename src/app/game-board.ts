import { GameResult } from './game-result';

export class GameBoard {
    // gameboard is a 2 by two matrix with the top left square at 0,0 and bottom right at 2, 2
    // 1 = x, 0 = blank, -1 = o;
    board:number[][];

    resetBoard() {
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ]
    }
    isEqual(check:number[][]):boolean {
        
        for(let i = 0; i < this.board.length; i++) {
            for(let j = 0; j < this.board[i].length; j++) {
                if(this.board[i][j] != check[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    getCloneBoard():number[][] {
        let newBoard = [];
        for(let i = 0; i < this.board.length; i++) {
            newBoard[i] = [];
            for(let j = 0; j < this.board[i].length; j++) {
                newBoard[i][j] = this.board[i][j].valueOf();
            }
        }
        return newBoard;
    }
    getMoves():number[][] {
        let moves:number[][] = [];
        for(let i = 0; i < this.board.length; i++) {
            for(let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] == 0) {
                    moves.push([i, j]);
                }
            }
        }

        return moves;
    }

    getWinMove(currentSide:number):number[] {

        let rowSums:number[] = [0, 0, 0];
        let colSums:number[] = [0, 0, 0];
        let diagSums:number[] = [0, 0];

        for(let i = 0; i < this.board.length; i++) {
            for(let j = 0; j < this.board[i].length; j++) {

                rowSums[i] += this.board[i][j];
                colSums[j] += this.board[i][j];
                if (i == j) {
                    diagSums[0] += this.board[i][j];
                }
                if(i + j == this.board.length -1) {
                    diagSums[1] += this.board[i][j];
                } 
            }
        }

        for(let i = 0; i < rowSums.length; i++) {
            if(rowSums[i] == 2 * currentSide) {
                for(let j = 0; j < this.board.length; j++ ) {
                    if(this.board[i][j] == 0) {
                        return [i, j];
                    }
                }
            }
        }

        for(let i = 0; i < colSums.length; i++) {
            if(colSums[i] == 2 * currentSide) {
                for(let j = 0; j < this.board.length; j++) {
                    if(this.board[j][i] == 0 ) {
                        return [j, i];
                    }
                }
            }
        }
        
        if(diagSums[0] * currentSide == 2) {
            for(let i = 0; i < this.board.length; i++) {
                if(this.board[i][i] == 0) {
                    return [i, i];
                }
            }
        }
        if(diagSums[1] * currentSide == 2) {
            for(let i = 0; i < this.board.length; i++) {
                if(this.board[i][2 - i] == 0) {
                    return [i, 2 - i];
                }
            }
        }

        for(let i = 0; i < rowSums.length; i++) {
            if(Math.abs(rowSums[i]) == 2) {
                for(let j = 0; j < this.board.length; j++ ) {
                    if(this.board[i][j] == 0) {
                        return [i, j];
                    }
                }
            }
        }

        for(let i = 0; i < colSums.length; i++) {
            if(Math.abs(colSums[i]) == 2) {
                for(let j = 0; j < this.board.length; j++) {
                    if(this.board[j][i] == 0 ) {
                        return [j, i];
                    }
                }
            }
        }
        if(Math.abs(diagSums[0]) == 2) {
            for(let i = 0; i < this.board.length; i++) {
                if(this.board[i][i] == 0) {
                    return [i, i];
                }
            }
        }
        if(Math.abs(diagSums[1]) == 2) {
            for(let i = 0; i < this.board.length; i++) {
                if(this.board[i][2 - i] == 0) {
                    return [i, 2 - i];
                }
            }
        }
        
        return undefined;
    }

    getResult():GameResult {
        
        let rowSums:number[] = [0, 0, 0];
        let colSums:number[] = [0, 0, 0];
        let diagSums:number[] = [0, 0];
        let hasBlanks:boolean = false;

        for(let i = 0; i < this.board.length; i++) {
            for(let j = 0; j < this.board[i].length; j++) {
                if(this.board[i][j] == 0) {
                    hasBlanks = true;
                }
                rowSums[i] += this.board[i][j];
                colSums[j] += this.board[i][j];
                if (i == j) {
                    diagSums[0] += this.board[i][j];
                }
                if(i + j == this.board.length - 1) {
                    diagSums[1] += this.board[i][j];
                } 
            }
        }

        for(let i = 0; i < rowSums.length; i++){
            if(Math.abs(rowSums[i]) == 3) {
                let winner = rowSums[i] / 3;
                let winningSpaces = [
                    [i, 0],
                    [i, 1],
                    [i, 2],
                ]
                return new GameResult(true, winningSpaces, winner);
            }
            if(Math.abs(colSums[i]) == 3) {
                let winner = colSums[i] / 3;
                let winningSpaces = [
                    [0, i],
                    [1, i],
                    [2, i],
                ]
                return new GameResult(true, winningSpaces, winner);
            }
            
        }

        if(Math.abs(diagSums[0]) == 3) {
            let winner = diagSums[0] / 3;
            let winningSpaces = [
                [0, 0],
                [1, 1],
                [2, 2],
            ]
            return new GameResult(true, winningSpaces, winner);
        }

        if(Math.abs(diagSums[1]) == 3) {
            let winner = diagSums[1] / 3;
            let winningSpaces = [
                [0, 2],
                [1, 1],
                [2, 0],
            ]
            return new GameResult(true, winningSpaces, winner);
        }

        if(hasBlanks == false) {
            return new GameResult(true, undefined, 0);
        }

        
        return new GameResult(false, undefined, undefined);
    }
}
