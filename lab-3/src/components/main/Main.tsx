import React, {Component} from "react";
import Network from "../../ts/Network";

type stateType = {
    sequence: number[]
}

class Main extends Component<{  }, stateType> {
    state = {
        sequence: [ 0.5, 1, 1.5, 0.5, 1, 1.5, 0.5, 1 ]
    }

    render() {

        const { sequence } = this.state;

        let network = new Network(sequence, 4, 0.0001, 0.0001);
        network.init();

        return(
            <main>

            </main>
        )
    }
}

export default Main;