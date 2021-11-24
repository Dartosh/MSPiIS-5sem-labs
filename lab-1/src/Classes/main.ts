import ImageObject from './image';

export default class Main {

    constructor(w: string, h: string, N: string, err: string) {
        let width: number = +w;
        let height: number = +h;
        let number_neural: number = +N;
        let error: number = +err;

        let image = <HTMLImageElement> document.querySelector('.startImage img');
        let alpha_X = 0.001;
        let alpha_Y = 0.001;


        let imageObject = new ImageObject(image, width, height, number_neural, error, alpha_X, alpha_Y);

        imageObject.paint();

        this.learning(imageObject);


        //image.src = "../images/...";

    }

    /**
     * @param {ImageObject} image
     */
    learning(image: ImageObject) {
        let iteration = 1;

        var intervalId = setInterval(function () {
            image.learning();

            image.paint();

            let content = <HTMLDivElement>document.querySelector('.loggerBlock__area');

            let newP = document.createElement('p');
            newP.innerHTML = `<p>Iteration: ${iteration++}, error: ${image.error}</p>`;

            content.appendChild(newP);

            content.scrollTop = content.scrollHeight;

            if (image.error < image.marginError) {
                let L = image.blockArray.length;
                let n = image.blockW;
                let m = image.blockH;
                let p = image.neuronsLength;
                let comp_coef = (n * m * 4 * L) / ((n * m * 4 + L) * p + 2);

                let newP = document.createElement('p');
                newP.innerHTML = `<p>Compression coefficient: ${comp_coef}</p>`;

                content.appendChild(newP);

                content.scrollTop = content.scrollHeight;

                clearInterval(intervalId);
            }
        });
    }

}