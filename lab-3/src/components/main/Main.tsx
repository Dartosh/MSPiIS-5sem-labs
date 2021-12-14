import React, {Component} from "react";
import JordanElmanNN from "../../ts/JordanElmanNN";

type stateType = {
    sequence: number[]
}

class Main extends Component<{  }, stateType> {
    state = {
        sequence: [ 1, 4, 9, 16, 25, 36, 49, 64 ]
    }

    render() {

        const { sequence } = this.state;

        let neuronNetwork = new JordanElmanNN(
            0.01,
            0.05,
            3,
            sequence,
            3);
        neuronNetwork.learn();

        return(
            <main>

            </main>
        )
    }
}

export default Main;