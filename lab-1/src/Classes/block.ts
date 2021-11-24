export default class Block {

    width: number;
    height: number;
    startPixelX: number;
    startPixelY: number;
    buffer: number[][];

    constructor(startPixelX: number, startPixelY: number, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.startPixelX = startPixelX;
        this.startPixelY = startPixelY;

        this.buffer = [];
    }

    add(pixels: number[][]) {
        this.buffer = pixels;
    }

    getMatrix() {
        return this.buffer;
    }
}