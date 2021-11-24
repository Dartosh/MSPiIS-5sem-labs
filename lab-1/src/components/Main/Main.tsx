import React, {Component, Fragment} from 'react';
import './Main.css'
import StartImg from "../ImageBlocks/StartImg";
import FinishImg from "../ImageBlocks/FinishImg";

class Main extends Component {
    state = {
        h: '',
        w: '',
        N: '',
        err: '',
        startImage: null,
        finishImage: null,
    }

    handleHeightChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        this.setState({
            h: e.target.value,
        })
    }

    handleWidthChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        this.setState({
            w: e.target.value,
        })
    }

    handleNeuronsChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        this.setState({
            N: e.target.value,
        })
    }

    handleErrorChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        this.setState({
            err: e.target.value,
        })
    }

    handleStart = ( e: React.MouseEvent<HTMLButtonElement> ) => {
        e.preventDefault();
        const { h, w, N, err } = this.state;
        console.log(`Block H: ${h}\nBlock W: ${w}\nNumber of neurons: ${N}\nMinimal error: ${err}`);
        this.setState({
            h: '',
            w: '',
            N: '',
            err: '',
        })
        //new MainFunc(w, h, N,err);
    }


    render() {
        const { h, w, N, err } = this.state;
        return(
            <Fragment>
                <div className="main">
                    <div className="inputBlock">
                        <h4>Input values:</h4>
                        <form>
                            <input type="text" placeholder="Height" value={h} onChange={this.handleHeightChange}/>
                            <input type="text" placeholder="Width" value={w} onChange={this.handleWidthChange}/>
                            <input type="text" placeholder="Number of neurons" value={N} onChange={this.handleNeuronsChange}/>
                            <input type="text" placeholder="Minimal error" value={err} onChange={this.handleErrorChange}/>
                            <button onClick={this.handleStart}>Start</button>
                        </form>
                    </div>
                    <div className="loggerBlock">
                        <h4>Logger:</h4>
                        <div className="loggerBlock__area">
                            <p>Lorem ipsum dolor sit amet.</p>
                        </div>
                    </div>
                    <StartImg />
                    <FinishImg />
                </div>
            </Fragment>
        )
    }
}

export default Main;