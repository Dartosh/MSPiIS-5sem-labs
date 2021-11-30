import React, { Component } from "react";
import image from "../images/losyash_256x256.bmp";

export default class StartImg extends Component {
    render() {
        return(
            <div className="startImage">
                <h4>Start image:</h4>
                <div className="imageZone">
                    <img src={image} id="start-img" alt='123'/>
                </div>
            </div>
        )
    }
}