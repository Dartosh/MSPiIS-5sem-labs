import React, { Component } from "react";


export default class FinishImg extends Component {
    render() {
        return(
            <div className="finishImage">
                <h4>Result image:</h4>
                <div className="imageZone">
                    <canvas className="canvas"></canvas>
                </div>
            </div>
        )
    }
}