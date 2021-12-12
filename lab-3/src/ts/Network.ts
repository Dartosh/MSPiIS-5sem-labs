import Matrix from "./Matrix";

class Network {
    private sequence: number[];
    private p: number;
    private alpha: number;
    private error: number;
    private m: number = 0;
    private X: number[][] = [];
    private s: number = 0;
    private currentContext: number[][] = [];
    private context: number[][] = [];
    private W: number[][] = [];
    private W_:number[][] = [];
    private contextWeight: number[][] = [];
    private errorSum: number = 0;
    private Q: number = 0;
    private vectorX: number[][] = [];


    constructor(sequence: number[], winSize: number, error: number, alpha: number) {
        this.sequence = sequence;
        this.p = winSize;
        this.alpha = alpha;
        this.error = error;
    }

    init() {
        this.m = this.sequence.length - this.p;
        this.X = Matrix.createMatrix(this.m, this.p);
        this.s = this.sequence.length;

        for(let i: number = 0; i < this.m; i++) {
            for (let j: number = 0; j < this.p; j++) {
                this.X[i][j] = this.sequence[i + j]
            }
        }

        this.currentContext = Matrix.createMatrix(1, this.m);
        this.context = Matrix.createMatrix(1, this.m);

        this.W = this.createWeight(this.p, this.m);
        this.W_ = this.createWeight(this.m, 1);
        this.contextWeight = this.createWeight(this.m, this.m);


        this.errorSum = 0;
        this.Q = 0;

        do {
            if(this.Q < 1000000) {
                for(let q: number = 0; q < this.m; q++) {
                    this.vectorX = Matrix.createMatrix(1, q);
                    this.vectorX[0] = this.X[q];
                    this.updateY();
                }
            }
        }while (this.errorSum > this.error);

    }

    createWeight(rows: number, cols: number): number[][] {
        let W: number[][] = Matrix.createMatrix(rows, cols);
        for(let i: number = 0; i < rows; i++)
            for(let j: number = 0; j < cols; j++)
                W[i][j] = Math.random()*2 - 1;
        return W;
    }

    updateY(): void {
        for(let i: number = 0; i < this.m; i++) {
            this.currentContext[0][i] = 0;
            for(let j: number = 0; j < this.p; j++) {
                this.currentContext[0][i] += this.vectorX[0][j] * this.W[j][i];
            }

            for(let k: number = 0; k < this.p; k++) {
                this.currentContext[0][i] += this.context[0][k] * this.contextWeight[0][i];
            }

            this.currentContext[0][i] =

        }
    }

    activation(value: number): number {
        if ()
    }
}

export default Network;