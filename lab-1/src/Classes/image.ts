import Block from '../Classes/block';
import Matrix from '../Classes/matrix';

export default class ImageObject {
    image: HTMLImageElement;
    blockArray: Block[];
    blockW: number;
    blockH: number;
    neuronsLength: number;
    weights: number[][] = [];
    _weights: number[][] = [];
    marginError: number;
    error: number = 0;
    context: any;
    alpha: number;
    _alpha: number;

    constructor(image: HTMLImageElement, blockWidth: number, blockHeight: number, middleNeurons: number, error: number, alpha_X:number, alpha_Y:number) {
        this.image = image;
        this.blockArray = [];
        this.blockW = blockWidth;
        this.blockH = blockHeight;
        this.neuronsLength = middleNeurons;
        this.marginError = error;
        this.alpha = alpha_X;
        this._alpha = alpha_Y;


        this.getImageData();
        this.createWeights();
    }

    paint() {
        this.blockArray.forEach((block) => {
            let X = block.getMatrix(),
                Y = Matrix.multipleMatrix(X, this.weights),
                _X = Matrix.multipleMatrix(Y, this._weights),
                imageData = this.context.getImageData(block.startPixelX, block.startPixelY, this.blockH, this.blockW);

            for (let i = 0; i < _X[0].length; i++) {
                let pixel = (_X[0][i] + 1) * 255 / 2;

                imageData.data[i] = pixel > 255 ? 255 : pixel < 0 ? 0 : pixel;
            }
            this.context.putImageData(imageData, block.startPixelX, block.startPixelY);
        });

    }

    getImageData() {
        let canvas = <HTMLCanvasElement> document.querySelector('canvas');

        canvas.width = this.image.width;
        canvas.height = this.image.height;

        this.context = canvas.getContext('2d');

        this.context.drawImage(this.image, 0, 0);
        this.createBlocks();

    }

    createBlocks() {
        for (let X = 0; X < this.image.width; X += this.blockW) {
            for (let Y = 0; Y < this.image.height; Y += this.blockH) {

                let data = this.context.getImageData(X, Y, this.blockW, this.blockH),
                    buffer = new Block(X, Y, this.blockW, this.blockH),
                    block = Array.prototype.slice.call(data.data);

                block = block.map((colorPixel: any) => {
                    return colorPixel / 255 * 2 - 1;
                });

                buffer.add([block]);
                this.blockArray.push(buffer)
            }
        }

    }

    createWeights() {
        let neuronSize = this.neuronsLength,
            blockLength = this.blockW * this.blockH * 4,
            buffer: number[][] = [];

        for (let i = 0; i < blockLength; i++) {
            buffer[i] = [];

            for (let j = 0; j < neuronSize; j++) {
                buffer[i][j] = Math.random() * 2 - 1;
            }
        }

        this.weights = buffer;
        this._weights = Matrix.transpose(buffer);

        this.weights = Matrix.normalize(this.weights);
        this._weights = Matrix.normalize(this._weights);
    }

    learning() {
        let blockArray = this.blockArray;

        blockArray.forEach((block) => {
            this.calculateWeights(block);
        });

        this.error = 0;

        blockArray.forEach((block) => {
            this.calculateError(block);
        });

    }

    calculateWeights(block: Block) {
        let X = block.getMatrix(),
            Y = Matrix.multipleMatrix(X, this.weights),
            _X = Matrix.multipleMatrix(Y, this._weights),
            dX = Matrix.minus(_X, X);

        let alpha = this.alpha || 1 / Matrix.vectorSum(X),
            _alpha = this.alpha || 1 / Matrix.vectorSum(Y);

        let w1 = Matrix.transpose(X),
            w2 = Matrix.multipleSkalar(w1, alpha),
            w3 = Matrix.multipleMatrix(w2, dX),
            w4 = Matrix.transpose(this._weights),
            w5 = Matrix.multipleMatrix(w3, w4);

        this.weights = Matrix.minus(this.weights, w5);

        let tw1 = Matrix.transpose(Y),
            tw2 = Matrix.multipleSkalar(tw1, _alpha),
            tw3 = Matrix.multipleMatrix(tw2, dX);

        this._weights = Matrix.minus(this._weights, tw3);

        this.weights = Matrix.normalize(this.weights);
        this._weights = Matrix.normalize(this._weights);
    }

    calculateError(block: Block) {
        let X = block.getMatrix(),
            Y = Matrix.multipleMatrix(X, this.weights),
            _X = Matrix.multipleMatrix(Y, this._weights);

        for (let i = 0; i < X[0].length; i++) {
            this.error += Math.pow((X[0][i] - _X[0][i]), 2)
        }
    }

}