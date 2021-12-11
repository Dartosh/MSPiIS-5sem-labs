import React, {Component} from 'react';
import { initArr, addArr } from '../../ts/constants';
import './Canvas.css';
import Network from '../../ts/Network';

type PixelState = {
    noisy: Array<Array<Array<number>>>,
    pattern: Array<Array<Array<number>>>,
    restored: Array<Array<Array<number>>>,
    isMouseDown: boolean,
}

export default class Canvas extends Component<{ }, PixelState> {
    state = {
        noisy: initArr(),
        pattern: initArr(),
        restored: initArr(),
        isMouseDown: false,
    }

    constructor(props: any) {
        super(props);
        this.handleClickNoisy = this.handleClickNoisy.bind(this);
        this.handleClickPattern = this.handleClickPattern.bind(this);
        this.addExample = this.addExample.bind(this);
        this.restoreImages = this.restoreImages.bind(this);
        this.handleMouseOverNoisy = this.handleMouseOverNoisy.bind(this);
        this.handleMouseDownNoisy = this.handleMouseDownNoisy.bind(this);
        this.handleMouseUpNoisy = this.handleMouseUpNoisy.bind(this);
        this.handleMouseOverPattern = this.handleMouseOverPattern.bind(this);
        this.handleMouseDownPattern = this.handleMouseDownPattern.bind(this);
        this.handleMouseUpPattern = this.handleMouseUpPattern.bind(this);
    }

    handleClickNoisy(e: React.MouseEvent<HTMLDivElement>, color: number, i: number, j: number, k: number) {
        let { noisy } = this.state;

        if(color === 1)
            noisy[i][j][k] = -1;
        else
            noisy[i][j][k] = 1;

        this.setState({
            noisy: noisy,
        });
    }
    handleMouseOverNoisy(e: React.MouseEvent<HTMLDivElement>, color: number, i: number, j: number, k: number) {
        let { noisy, isMouseDown } = this.state;

        if(isMouseDown) {
            if(color === 1)
                noisy[i][j][k] = -1;
            else
                noisy[i][j][k] = 1;

            this.setState({
                noisy: noisy,
            });
        }
    }
    handleMouseDownNoisy(e: React.MouseEvent<HTMLDivElement>) {
        let { isMouseDown } = this.state;
        isMouseDown = true;
        this.setState({
            isMouseDown: isMouseDown,
        });
    }
    handleMouseUpNoisy(e: React.MouseEvent<HTMLDivElement>) {
        let { isMouseDown } = this.state;
        isMouseDown = false;
        this.setState({
            isMouseDown: isMouseDown,
        });
    }


    handleClickPattern(e: React.MouseEvent<HTMLDivElement>, color: number, i: number, j: number, k: number) {
        let { pattern } = this.state;

        if(color === 1)
            pattern[i][j][k] = -1;
        else
            pattern[i][j][k] = 1;

        this.setState({
            pattern: pattern,
        });
    }
    handleMouseOverPattern(e: React.MouseEvent<HTMLDivElement>, color: number, i: number, j: number, k: number) {
        let { pattern, isMouseDown } = this.state;

        if(isMouseDown) {
            if(color === 1)
                pattern[i][j][k] = -1;
            else
                pattern[i][j][k] = 1;

            this.setState({
                pattern: pattern,
            });
        }
    }
    handleMouseDownPattern(e: React.MouseEvent<HTMLDivElement>) {
        let { isMouseDown } = this.state;
        isMouseDown = true;
        this.setState({
            isMouseDown: isMouseDown,
        });
    }
    handleMouseUpPattern(e: React.MouseEvent<HTMLDivElement>) {
        let { isMouseDown } = this.state;
        isMouseDown = false;
        this.setState({
            isMouseDown: isMouseDown,
        });
    }


    addExample(e: React.MouseEvent<HTMLButtonElement>): void {
        const { noisy, pattern } = this.state;
        if(noisy.length <= 3) {
            this.setState({
                noisy: addArr(noisy),
                pattern: addArr(pattern),
            });
        }
    }

    restoreImages(e: React.MouseEvent<HTMLButtonElement>): void {
        const { noisy, pattern } = this.state;
        let network = new Network(pattern, noisy);
        this.setState({
            restored: network.getRestoredImages(),
        });
    }


    render() {
        const { noisy, pattern, restored } = this.state;

        return(
            <div className='main'>
                <div className='infoBlock'>
                    <h3>Patterns: </h3>
                    <div className='table-container'>
                        {pattern.map((matrix, i) => (
                            <div className='ptable' key={`${i}`}>
                                {matrix.map((row, j) => (
                                    row.map((element, k) => (
                                        <div
                                            className={element === -1 ? 'pw' : 'pb'}
                                            onClick={(event) => this.handleClickPattern(event, element, i, j, k)}
                                            key={`${i}${j}${k}`}
                                            onMouseDown={this.handleMouseDownPattern}
                                            onMouseUp={this.handleMouseUpPattern}
                                            onMouseOver={(event) => this.handleMouseOverPattern(event, element, i, j, k)}
                                        >
                                        </div>
                                    ))
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="infoBlock">
                    <h3>Noisy: </h3>
                    <div className='table-container'>
                        {noisy.map((matrix, i) => (
                            <div className='ptable' key={`${i}`}>
                                {matrix.map((row, j) => (
                                    row.map((element, k) => (
                                        <div
                                            className={element === -1 ? 'pw' : 'pb'}
                                            onClick={(event) => this.handleClickNoisy(event, element, i, j, k)}
                                            key={`${i}${j}${k}`}
                                            onMouseDown={this.handleMouseDownNoisy}
                                            onMouseUp={this.handleMouseUpNoisy}
                                            onMouseOver={(event) => this.handleMouseOverNoisy(event, element, i, j, k)}
                                        >
                                        </div>
                                    ))
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={this.addExample}>
                        Add
                    </button>
                    <button onClick={this.restoreImages}>
                        Restore images
                    </button>
                </div>
                <div className="infoBlock">
                    <h3>Restored: </h3>
                    <div className='table-container'>
                        {restored.map((matrix, i) => (
                            <div className='ptable' key={`${i}`}>
                                {matrix.map((row, j) => (
                                    row.map((element, k) => (
                                        <div
                                            className={element === -1 ? 'pw' : 'pb'}
                                            key={`${i}${j}${k}`}
                                        >
                                        </div>
                                    ))
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}