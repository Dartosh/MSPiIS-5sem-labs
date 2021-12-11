import Matrix from './Matrix';

class Network {
    private readonly width: number;
    private readonly n: number;
    private weightMatrix: number[][];
    private readonly patternImages: number[][][];
    private readonly noisyImages: number[][][];
    private restoredImages: number [][][];
    private q: number;

   getRestoredImages(): number[][][] {
        return this.restoredImages;
    }

    constructor(patterns: number[][][], noisyImages: number[][][]) {
        this.patternImages = patterns;
        this.noisyImages = noisyImages;
        this.weightMatrix = [];
        this.restoredImages = [];
        this.width = patterns[0][0].length;
        this.n = patterns[0].length * patterns[0][0].length;
        this.q = this.n / 2 * Math.log2(this.n);
        this.createWightMatrix();
        this.relaxation();
    }


    createWightMatrix(): void {
        // Объединение всех эталонных изображений в одну матрицу
        let X: number[][] = [];
        for(let i: number = 0; i < this.patternImages.length; i++) {
            let temp: number[] = [];
            for(let j: number = 0; j < this.patternImages[i].length; j++)
                for(let k: number = 0; k < this.patternImages[i][j].length; k++)
                    temp.push(this.patternImages[i][j][k]);
            X.push(temp);
        }


        let transposeX: number[][] = Matrix.transpose(X);

        this.weightMatrix = [];
        for(let i: number = 0; i < this.n; i++){
            let temp: number[] = [];
            for(let j: number = 0; j < this.n; j++)
                temp.push(0);
            this.weightMatrix.push(temp);
        }


        for(let k: number = 0; k < X.length; k++) {
            let partOfEnumerator = [];
            for(let i: number = 0; i < this.n; i++){
                let temp: number[] = [];
                for(let j: number = 0; j < this.n; j++)
                    temp.push(0);
                partOfEnumerator.push(temp);
            }

            for(let i: number = 0; i < this.weightMatrix.length; i++) {
                for(let j: number = 0; j < this.weightMatrix[i].length; j++) {
                    partOfEnumerator[i][j] = this.weightMatrix[i][j] * X[k][j] - X[k][j];
                }
            }
            partOfEnumerator = Matrix.transpose(partOfEnumerator);

            for(let i: number = 0; i < this.weightMatrix.length; i++) {
                for(let j: number = 0; j < this.weightMatrix[i].length; j++) {
                    let denominator: number = transposeX[j][k] * X[k][j] - transposeX[j][k] * this.weightMatrix[i][j] * X[k][j];
                    if (denominator !== 0) {
                        this.weightMatrix[i][j] += this.weightMatrix[i][j] + (((this.weightMatrix[i][j] * X[k][j] - X[k][j]) * partOfEnumerator[i][j]) / denominator);
                    }
                }
                this.weightMatrix[i][i] = 0;
            }
        }
    }


    relaxation(): void {
        //Промежуточный результат
        let Y: number[] = [];
        for(let i: number = 0; i < this.n; i++)
            Y.push(0);

        let counter: number = 0;
        // Объединение всех зашумлённых изображений в одну матрицу
        let noisyX: number[][] = [];
        for(let i: number = 0; i < this.noisyImages.length; i++) {
            let temp: number[] = [];
            for(let j: number = 0; j < this.noisyImages[i].length; j++)
                for(let k: number = 0; k < this.noisyImages[i][j].length; k++)
                    temp.push(this.noisyImages[i][j][k]);
            noisyX.push(temp);
        }
        console.log(noisyX);

        this.restoredImages = [];
        for(let i: number = 0; i < this.noisyImages.length; i++) {
            let temp: number[][] = [];
            for(let j: number = 0; j < this.noisyImages[i].length; j++) {
                let temp2: number[] = [];
                temp.push(temp2);
            }
            this.restoredImages.push(temp);
        }

        for(let k: number = 0; k < noisyX.length; k++) {
            for(let i: number = 0; i < this.n; i++) {
                Y[i] = 0;
                for(let j: number = 0; j < this.n; j++)
                    Y[i] += this.weightMatrix[i][j] * noisyX[k][j];
                Y[i] = this.sign(Y[i]);
            }

            console.log(Y);

            while (Y.length > 0)
                this.restoredImages[counter].push(Y.splice(0, this.width));

            counter++
        }
    }




    // @ts-ignore
    sign(x: number): number {
        if (x > 0) {
            return 1;
        }
        else if (x <= 0) {
            return -1;
        }
    }
}

export default Network;