export class MoveScore {
    move:number[];
    score:number;
    drawCount:number;
    constructor(move:number[], score:number=0, drawCount:number=0) {
        this.move = move;
        this.score = score;
        this.drawCount = drawCount;
    }
}
