import React, {Component} from "react";
import JordanElmanNN from "../../ts/JordanElmanNN";
import './Main.css'
type stateType = {
    sequence: number[],
    answer: number[],
    result: number[],
    neuronsNumber: string,
    minimalError: string,
    learningCoef: string,
    predictCount: string,
    currentNewElement: string,
}

class Main extends Component<{  }, stateType> {
    state = {
        sequence: [],
        answer: [],
        result: [],
        neuronsNumber: '',
        minimalError: '',
        learningCoef: '',
        predictCount: '',
        currentNewElement: '',
    }

    constructor(props: any) {
        super(props);
        this.handleLearningCoefChange = this.handleLearningCoefChange.bind(this);
        this.handleNeuronsOnChange = this.handleNeuronsOnChange.bind(this);
        this.handleMinErrOnChange = this.handleMinErrOnChange.bind(this);
        this.handlePredictCountChange = this.handlePredictCountChange.bind(this);
        this.handleAddValueOnClick = this.handleAddValueOnClick.bind(this);
        this.handleAddValueOnChange = this.handleAddValueOnChange.bind(this);
        this.handleDeleteValueOnClick = this.handleDeleteValueOnClick.bind(this);
        this.handleStartLearningOnClick = this.handleStartLearningOnClick.bind(this);
    }


    handleNeuronsOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();
        this.setState({
            neuronsNumber: e.target.value,
        });
    }

    handleMinErrOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();
        this.setState({
            minimalError: e.target.value,
        });
    }

    handleLearningCoefChange(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();
        this.setState({
            learningCoef: e.target.value,
        });
    }

    handlePredictCountChange(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();
        this.setState({
            predictCount: e.target.value,
        });
    }

    handleStartLearningOnClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();

        let { sequence, learningCoef, minimalError, predictCount, neuronsNumber } = this.state;
        let { answer } = this.state;
        //let a: number[] = [2,4,6,8,10,12,14,16,18,20,22,24]

        // let neuronNetwork = new JordanElmanNN(
        //     parseFloat(learningCoef),
        //     parseFloat(minimalError),
        //     parseInt(neuronsNumber),
        //     a,
        //     parseInt(predictCount));
        let neuronNetwork = new JordanElmanNN(
            parseFloat(learningCoef),
            parseFloat(minimalError),
            parseInt(neuronsNumber),
            sequence,
            parseInt(predictCount)+1,
        )
        // @ts-ignore
        answer = neuronNetwork.getAnswer();
        this.setState({
            answer: answer,
        })

        let { result } = this.state;

        result = [];
        result = sequence.concat(result);
        for(let i: number = 0; i < result.length; i++)
            if(answer[0] == result[i]) {
                // @ts-ignore
                result[i] = parseFloat(answer[1].toFixed(2));
                if(parseInt(predictCount) > 1)
                    for(let j: number = 2; j < answer.length; j++) {
                        // @ts-ignore
                        result[i + j - 1] = parseFloat(answer[j].toFixed(2));
                    }
                break;
            }

        console.log(result);
        this.setState({
            result: result,
        })

    }

    handleAddValueOnClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        let { sequence, currentNewElement } = this.state;
        // @ts-ignore
        sequence.push(parseInt(currentNewElement));
        this.setState({
            sequence: sequence,
            currentNewElement: '',
        });
    }



    handleDeleteValueOnClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        let { sequence } = this.state;
        sequence.pop();
        this.setState({
            sequence: sequence,
        });
    }

    handleAddValueOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
        e.preventDefault();
        this.setState({
            currentNewElement: e.target.value,
        });
    }

    render() {

        const { result, sequence, learningCoef, minimalError, predictCount, neuronsNumber, currentNewElement, answer } = this.state;


        // let neuronNetwork = new JordanElmanNN(
        //     0.001,
        //     0.01,
        //     3,
        //     a,
        //     3);

        return(
            <main>
                <article className="start-result">

                    <div>
                        <h4>Input values:</h4>
                        <ul>
                            {sequence.map((id: number) => (
                                <li>{id}</li>))}
                        </ul>
                    </div>
                    <div>
                        <h4>Result values:</h4>
                        <ul>
                            {result.map((id: number) => (
                                <li>{id}</li>
                            ))}
                        </ul>
                    </div>
                </article>
                <article className="input">
                    <h4>Input sequence:</h4>
                    <form>
                        <input
                            type="text"
                            placeholder="Neurons on hidden layer"
                            value={currentNewElement}
                            onChange={this.handleAddValueOnChange}/>
                        <button onClick={this.handleAddValueOnClick}>Add</button>
                        <button onClick={this.handleDeleteValueOnClick}>Delete</button>
                    </form>
                </article>
                <article>
                    <h4>Settings:</h4>
                    <form>
                        <label>Neurons on hidden layer:</label>
                        <input
                            type="text"
                            value={neuronsNumber}
                            onChange={this.handleNeuronsOnChange}
                            placeholder="Neurons on hidden layer" />
                        <label>Minimal error:</label>
                        <input
                            type="text"
                            placeholder="Minimal error"
                            value={minimalError}
                            onChange={this.handleMinErrOnChange}/>
                        <label>Predict count:</label>
                        <input
                            type="text"
                            placeholder="Predict count"
                            value={predictCount}
                            onChange={this.handlePredictCountChange}/>
                        <label>Learning coefficient:</label>
                        <input
                            type="text"
                            placeholder="Learning coefficient"
                            value={learningCoef}
                            onChange={this.handleLearningCoefChange}/>
                        <button onClick={this.handleStartLearningOnClick}>Learning</button>
                    </form>
                </article>
            </main>
        )
    }
}

export default Main;