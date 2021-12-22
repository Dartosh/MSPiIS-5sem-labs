import Neuron from "./Neuron";

class JordanElmanNN {
    private hiddenLayer: Array<Neuron> = [];
    private exitNeuron: Neuron;
    private contextNumber: number;
    private numberOfPredictions: number;
    private context: number[] = [];
    private allSequence: number[] = [];
    private predictedValue = 0;
    private newPredictedValue = 0;
    private learningCoef: number;
    private errorValue: number;
    private hiddenNeuronsNumber: number;
    private imagesMatrix: number[][];
    private answerArray: number[];

    readonly MAX_ITERATIONS: number = 1000000;

    constructor(
        learningCoef: number,
        errorValue: number,
        hiddenNeuronsNumber: number,
        allSequence: number[],
        numberOfPredictions: number) {

        // let a: number[] = [1,2,3];
        // let b: number[] = [4,5,6];
        // b = a.concat(b)
        // console.log(b);
        this.answerArray = [];
        this.learningCoef = learningCoef;
        this.errorValue = errorValue;
        this.hiddenNeuronsNumber = hiddenNeuronsNumber;
        this.allSequence = allSequence;
        this.numberOfPredictions = numberOfPredictions;
        this.contextNumber = hiddenNeuronsNumber + 1;
        let inputs: number = hiddenNeuronsNumber + this.contextNumber;
        this.createHiddenLayer(inputs, hiddenNeuronsNumber);
        this.exitNeuron = new Neuron(hiddenNeuronsNumber, (x) => {return x});
        this.createContext();
        this.imagesMatrix = this.createImagesMatrix(
            allSequence, 3, hiddenNeuronsNumber + 1);

        this.learn(this.imagesMatrix);

    }

    learn(imageMatrix: number[][]): void {
        let error: number = Number.MAX_VALUE;
        let answerPredicted: number = 0;
        let iterationNumber: number = 0;
        let answerExpected: number = 0;
        this.predictedValue = 0;
        while(this.errorValue < error) {
            iterationNumber++;
            for(let i: number = 0; i < imageMatrix.length; i++)
                this.predictedValue = this.adaptWeights(this.copyArray(imageMatrix[i]));
            //console.log(this.predictedValue);
            error = this.calculateError(imageMatrix);
            answerPredicted = this.predictedValue;
            answerExpected = this.expectedValue(imageMatrix);
            console.log(`Iteration: ${iterationNumber}\n
            Expected value: ${answerExpected}\n
            Predicted value: ${this.predictedValue}\n
            Error: ${error}`);
            if(iterationNumber === this.MAX_ITERATIONS)
                console.log('MAX ITERATION');
        }
        this.answerArray.push(answerExpected);
        this.answerArray.push(answerPredicted);

        if(this.numberOfPredictions != 1)
            this.countOtherValues(this.copyArray(imageMatrix));
    }

    countOtherValues(imageMatrix: number[][]): void {
        const image: number[] = this.copyArray(imageMatrix[imageMatrix.length - 1]);
        let temp: number = 0;
        let lastImage: number[] = [];
        for(let i: number = 1; i < image.length - 1; i++)
            lastImage.push(image[i]);
        let lastValue: number = this.allSequence[imageMatrix.length + imageMatrix[0].length - 2];
        lastImage.push(lastValue);
        for (let i: number = 2; i < this.numberOfPredictions; i++) {
            lastValue = this.allSequence[imageMatrix.length + imageMatrix[0].length - 2 + i - 1];
            temp = this.calculateY(this.copyArray(lastImage));
            this.answerArray.push(temp);
            console.log(`Expected value №${i}: ${lastValue}`);
            console.log(`Predicted value №${i}: ${temp}`);
            lastImage.push(lastValue);
            lastImage.shift();
        }
    }

    expectedValue(imageMatrix: number[][]): number {
        const lastElement: number[] = imageMatrix[imageMatrix.length - 1];
        return lastElement[lastElement.length - 1];
    }

    calculateError(other: number[][]): number {
        let error: number = 0;
        for(let i: number = 0; i < other.length; i++) {
            const imageCopy: number[] = this.copyArray(other[i]);
            let expectedValue: any = imageCopy.pop();
            // console.log(`${expectedValue}`);
            const deltaValue: number = expectedValue - this.calculateY(imageCopy);
            //console.log(`${this.calculateY(imageCopy)}`);
            error += this.calculateDeltaError(deltaValue);
        }
        return error;
    }

    getAnswer(): number[] {
        return this.answerArray;
    }

    calculateDeltaError(deltaValue: number) {
        return deltaValue * deltaValue / 2;
    }

    calculateY(image: number[]): number {
        image = this.context.concat(image);
        // console.log(`${this.context}`);
        // console.log(`${image}`);
        // console.log(`${this.context}`);
        let hiddenResult: number[] = [];

        for(let i: number = 0; i < this.hiddenLayer.length; i++)
            hiddenResult.push(this.hiddenLayer[i].calculate(image));

        this.context = hiddenResult;

        const y: number = this.exitNeuron.calculate(hiddenResult);
        this.context.push(y);
        //console.log(`${y}`);

        return y;
    }

    adaptWeights(sequence: number[]): number {

        let expectedValue: any = sequence.pop();
        let hiddenResult: number[] = [];
        // Добавление на вход пред состояния нейрона выхода и нейронов скрытого слоя
        sequence = this.copyArray(this.context).concat(sequence)
        //console.log(`${sequence}`);
        this.context = [];

        // Подсчет значения нейронов скрытого слоя
        for(let i: number = 0; i < this.hiddenLayer.length; i++)
            hiddenResult.push(this.hiddenLayer[i].calculate(sequence));

        this.context = hiddenResult;

        // Подсчет значения выходного нейрона
        const calculatedValue: number = this.exitNeuron.calculate(hiddenResult);
        this.context.push(calculatedValue);
        const deltaValue: number = expectedValue - calculatedValue;

        // Изменение весов выходного нейрона
        const oldExitWeights: number[] = this.exitNeuron.getWeights();
        const newExitWeights: number[] = [];
        const deltaExitThreshold = this.learningCoef * deltaValue;

        // Корректировка весов выходного нейрона
        for(let i: number = 0; i < oldExitWeights.length; i++) {
            let deltaExitWeights = -deltaExitThreshold * hiddenResult[i];
            newExitWeights.push(oldExitWeights[i] - deltaExitWeights);
        }

        this.exitNeuron.setThreshold(this.exitNeuron.getThreshold() + deltaExitThreshold);
        this.exitNeuron.setWeights(newExitWeights);

        // Корректировка весов нейронов скрытого слоя
        for(let i = 0; i < this.hiddenLayer.length; i++) {
            const neuron: Neuron = this.hiddenLayer[i];
            const oldWeights: number[] = neuron.getWeights();
            const newWeights: number[] = [];
            const hiddenThreshold: number = this.learningCoef * deltaValue * oldExitWeights[i];
            let deltaHiddenWeight = -hiddenThreshold * this.derivative(neuron.getSum()) * sequence[i];

            for(let j: number = 0; j < oldWeights.length; j++)
                newWeights.push(oldWeights[j] - deltaHiddenWeight);

            neuron.setThreshold(neuron.getThreshold() + hiddenThreshold);
            neuron.setWeights(newWeights);
        }
        return calculatedValue;
    }

    createContext(): void {
        this.context = [];
        for(let i: number = 0; i < this.contextNumber; i++)
            this.context.push(0);
    }

    createHiddenLayer(inputNumber: number, hiddenNeuronsNumber: number): void {
        for(let i: number = 0; i < hiddenNeuronsNumber; i++) {
            let temp: Neuron = new Neuron(inputNumber, this.activation);
            this.hiddenLayer.push(temp);
        }

    }

    activation(S: number): number {
        // return Math.max(0.01*S, S);
        return Math.log(S + Math.sqrt(S * S + 1));
    }

    derivative(S: number) {
        // if(S > 0)
        //     return 1;
        // else
        //     return 0.01;
        return 1 / Math.sqrt(S * S + 1);
    }

    createImagesMatrix(sequence: number[], imagesCount: number, imageLength: number): number[][] {
        let flag: number = 0;
        let images: number[][] = [];
        for(let i: number = 0; i < imagesCount; i++) {
            let image: number[] = [];
            for(let j: number = 0; j < imageLength; j++) {
                image.push(sequence[flag]);
                flag++;
            }
            images.push(image);
            flag -= imageLength - 1;
        }
        return images;
    }

    copyArray<T>(value: Array<T>): Array<T> {
        let list: Array<T> = [];
        list = value.concat(list);
        return list;
    }

}

export default JordanElmanNN;