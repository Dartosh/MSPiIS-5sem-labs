
class Neuron {
    private activation: (x:number) => number;
    private inputNumber: number;
    private weights: number[];
    private threshold: number;
    private sum: number;

    constructor(inputNumber: number, activation: (x:number) => number) {
        this.inputNumber = inputNumber;
        this.weights = [];
        this.createWeights();
        this.threshold = 0;
        this.sum = 0;
        this.activation = activation;
    }

    calculate(inputs: number[]): number {
        //console.log(`inputs: ${inputs}`);
        let sum: number = 0;
        for(let i: number = 0; i < inputs.length; i++)
            sum += inputs[i] * this.weights[i];
        this.sum = sum;
        //console.log(`act: ${this.activation(sum)}`);
        return this.activation(sum) - this.threshold;
    }

    createWeights() {
        for(let i: number = 0; i < this.inputNumber; i++)
            this.weights.push(Math.random() * 2 - 1);
    }

    setWeights(weights: number[]): void {
        this.weights = weights;
    }
    setThreshold(threshold: number): void {
        this.threshold = threshold;
    }
    getWeights(): number[] {
        return this.weights;
    }
    getThreshold(): number {
        return this.threshold;
    }
    getSum(): number {
        return this.sum;
    }
}

export default Neuron;