import React, { Component } from "react";

type ImageProps = {
    readonly image?: HTMLImageElement,
}

type ImageState = {
    image: HTMLImageElement,
}

export default class FinishImg extends Component<ImageProps, ImageState> {

    constructor(props: ImageProps) {
        super(props);
    }

    render() {
        return(
            <div className="finishImage">
                <h4>Result image:</h4>
                <div className="imageZone">
                </div>
            </div>
        )
    }
}