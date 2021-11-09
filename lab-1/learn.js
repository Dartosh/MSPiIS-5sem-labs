// ЭТАП 1
// Извлечение значения RGB каждого пикселя

let img = new Image(); //Объект типа Image
img.src = './d5.jpg'; //Путь к изображению
const matrix = []; //Матрица для хранения строк пикселей

// []
// []
// ..
// []

//Берём изображение с холста
const canvas = document.getElementById('image');
//Получаем контекст визуализации, типа 2d
const ctx = canvas.getContext('2d');


//Загрузка изображения на холст
const onImageLoad = () => {
    console.log("Bla-bla-bla");
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x++) {

        const column = []; // Массив содержащий строку пикселей
        //[] [] ... []

        // Наполнение матрицы значениями RGB каждого пикселя
        for (let y = 0; y < canvas.height; y++) {
            const start = 4 * (x * canvas.width + y);
            const r = imageData.data[start];
            const g = imageData.data[start + 1];
            const b = imageData.data[start + 2];

            let pixel = {
                red: r,
                green: g,
                blue: b,
            }

            const color = `${r}-${g}-${b}`;
            column.push(pixel);
        }
        matrix.push(column); // Матрица пикселей с rgb
    }

    // for(let i = 0; i < 10; i++) {
    //     for (let j = 0; j < 10; j++)
    //         console.log(matrix[i][j].blue)
    //     console.log('\n')
    // }

    /*const output = document.createElement('pre');
    output.innerHTML = JSON.stringify(matrix, null, 2);
    document.body.appendChild(output);*/

    let inputData = {
        xSize: 4,
        ySize: 4,
        P: 12,
        error: 600,
    };


    const RAND_MAX = 2147483647;

// Размеры матрицы
    const matrixWidth = matrix[1].length;
    const matrixHeight = matrix.length;

//Вводимые значения
    const rectangleWidth = inputData.xSize;
    const rectangleHeight = inputData.ySize;
    const P = inputData.P;
    const err = inputData.error;

// Матрица со значениями RGB пикселей
    const matrixRGB = matrix;

// Количество блоков
    let amountOfBlocks = Math.floor((matrixHeight/rectangleHeight)*(matrixWidth/rectangleWidth));

// Длина эталонных образов
    const N = rectangleWidth * rectangleHeight * 3;

// Матрица с преобразованными значениями RGB
    let X = [];
    for(let i = 0; i < amountOfBlocks; i++) {
        let subX = [];
        for(let j = 0; j < N; j++)
            subX.push(0);
        X.push(subX);
    }

    let nextX = [];
    for(let i = 0; i < amountOfBlocks; i++) {
        let subArr = [];
        for(let j = 0; j < N; j++)
            subArr.push(0);
        nextX.push(subArr);
    }

    let deltaX = [];
    for(let i = 0; i < amountOfBlocks; i++) {
        let subArr = [];
        for(let j = 0; j < N; j++)
            subArr.push(0);
        deltaX.push(subArr);
    }

    let multiDX = [];
    for(let i = 0; i < P; i++)
        multiDX.push(0);


    let Y = [];
    for (let i = 0; i < amountOfBlocks; i++) {
        let subY = [];
        for (let j = 0; j < P; j++)
            subY.push(0);
        Y.push(subY);
    }

    // Координаты блока
    let blockNumberIntoX = 0;
    let blockNumberIntoY = 0;

    // Номер цвета
    let colorNumber;

    for(let g = 0; g < amountOfBlocks; g++) {

        colorNumber = 0;

        //let subX = [];
        for(let i = 0 + blockNumberIntoY * rectangleHeight; i < (blockNumberIntoY + 1) * rectangleHeight; i++) {
            for(let j = blockNumberIntoX * rectangleWidth; j < (blockNumberIntoX + 1) * rectangleWidth; j++) {

                X[g][colorNumber] = (2 * (matrix[i][j].red / 255.0)) - 1;
                colorNumber++;

                X[g][colorNumber] = (2 * (matrix[i][j].green / 255.0)) - 1;
                colorNumber++;

                X[g][colorNumber] = (2 * (matrix[i][j].blue / 255.0)) - 1;
                colorNumber++;


                //subX.push((2 * (matrix[i][j].red / 255.0)) - 1);
                //subX.push((2 * (matrix[i][j].green / 255.0)) - 1);
                //subX.push((2 * (matrix[i][j].blue / 255.0)) - 1);
            }
        }
        //X.push(subX);

        blockNumberIntoX++;

        if(blockNumberIntoX >= Math.floor(matrixWidth / rectangleWidth))
        {
            blockNumberIntoX = 0;
            blockNumberIntoY++;
        }
    }

    // Массивы Весов
    let W = [];
    for(let i = 0; i < N; i++) {
        let subW = [];
        for(let j = 0; j < P; j++)
            subW.push(0);
        W.push(subW);
    }

    let nextW = [];
    for(let i = 0; i < P; i++) {
        let subNextW = [];
        for(let j = 0; j < N; j++)
            subNextW.push(0);
        nextW.push(subNextW);
    }

    // Задается первая весовая матрица
    for(let i = 0; i < N; i++)
    {
        for(let j = 0; j < P; j++)
        {
            W[i][j] = (Math.random() - 1) / 5;  // Задаём рандомные веса
        }
    }


    for(let i = 0; i < N; i++)
    {
        for(let j = 0; j < P; j++)
        {
            nextW[j][i] = W[i][j]; // Транспонируем матрицу весов
        }
    }

    let amountOfIterations = 0;

// Шаги обучения двух весовых матриц
    let nextAlpha, alpha = 0.001;

    while(true)
    {
        amountOfIterations++;

        for(let i = 0; i < amountOfBlocks; i++)
        {
            countY(i); // вычисление второго слоя

            countNextX(i); // вычисление  третьего слоя

            countDeltaX(i); // разница м\у Х' и Х

            nextAlpha = countNextAlpha(i); // вычисление адаптивного шага обучения

            changeNextW(i, nextAlpha); // изменение весов по формуле

            //alpha = countAlpha(i); // вычисление адаптивного шага

            changeW(i, alpha); //  изменение первой высовыой матрицы
        }

        for(let i = 0; i < amountOfBlocks; i++){
            countY(i); // вычисляем второй слой
            countNextX(i); // вычисляем третий слой
            countDeltaX(i); // вычисляем разницу м\у Х' и Х. здесь же получем Е
        }

        if(checkE(err)) // сравнение заданной и полученной ошибки
        {
            break;
        }
    }

    console.log(`Amount of iterations: ${amountOfIterations} \n`);

    configureMatrix();
    printZ(); // ф-ция  коэффициента сжатия


    function checkE(e) {
        let E = 0;
        for(let i = 0; i < amountOfBlocks; i++)
        {
            for(let j = 0; j < N; j++)
            {
                E += deltaX[i][j] * deltaX[i][j];
            }
        }
        console.log(`Medium error: ${E}\n`);

        return E <= e;
    }

    function changeW(blockNumber, alpha) {
        for(let i = 0; i < P; i++)
        {
            let tempResult = 0.0;
            for(let j = 0; j < N; j++)
            {
                tempResult += deltaX[blockNumber][j] * nextW[i][j];
            }
            multiDX[i] = tempResult;
        }

        for(let i = 0; i < N; i++)
        {
            for(let j = 0; j < P; j++)
            {
                W[i][j] -= alpha * X[blockNumber][i] * multiDX[j];
            }
        }
    }

    function changeNextW(blockNumber, nextAlpha) {
        for(let i = 0; i < P; i++)
        {
            for(let j = 0; j < N; j++)
            {
                nextW[i][j] -= nextAlpha * Y[blockNumber][i] * deltaX[blockNumber][j];
            }
        }
    }

    // коэффициент обучения
    function countAlpha(blockNumber) {
        let alpha = 0.0;

        let sum = N * N;

        for(let i = 0; i < N; i++)
        {
            sum += X[blockNumber][i] * X[blockNumber][i];
        }

        alpha = 1.5 /(1.0 * sum);

        return alpha;
    }

    function countNextAlpha(blockNumber) {
        let nextAlpha = 0.0;

        let sum = N * N;

        for(let i = 0; i < P; i++)
        {
            sum += Y[blockNumber][i] * Y[blockNumber][i];
        }

        nextAlpha = 1.5 /(1.0 * sum);

        return nextAlpha;
    }

    function countDeltaX(blockNumber) {
        for(let i = 0; i < N; i++)
        {
            deltaX[blockNumber][i] = nextX[blockNumber][i] - X[blockNumber][i];
        }
    }

    function countNextX(blockNumber) {
        for(let i = 0; i < N; i++)
        {
            for(let j = 0; j < P; j++)
            {
                nextX[blockNumber][i] += Y[blockNumber][j] * nextW[j][i];
            }
        }
    }

    function countY(blockNumber) {
        for(let i = 0; i < P; i++) {
            Y[blockNumber][i] = 0.0;
            for(let j = 0; j < N; j++) {
                Y[blockNumber][i] += X[blockNumber][j] * W[j][i];
            }
        }
    }

    function configureMatrix() {
        let blockNumberIntoX = 0;
        let blockNumberIntoY = 0;
        let colorNumber;

        for(let g = 0; g < amountOfBlocks; g++)
        {
            colorNumber = 0;
            for(let i = blockNumberIntoY * rectangleHeight; i < (blockNumberIntoY + 1) * rectangleHeight; i++)
            {
                for(let j = blockNumberIntoX * rectangleWidth; j < (blockNumberIntoX + 1) * rectangleWidth; j++)
                {
                    matrixRGB[i][j].red = restorePixel(g, colorNumber);
                    colorNumber++;

                    matrixRGB[i][j].green = restorePixel(g, colorNumber);
                    colorNumber++;

                    matrixRGB[i][j].blue = restorePixel(g, colorNumber);
                    colorNumber++;
                }
            }

            blockNumberIntoX++;

            if(blockNumberIntoX >= Math.floor(matrixWidth / rectangleWidth))
            {
                blockNumberIntoX = 0;
                blockNumberIntoY++;
            }
        }

    }

    function restorePixel(g, colorNumber) {
        let temp = 255.0 * ((nextX[g][colorNumber] + 1) / 2.0);
        if(temp > 255.0){
            temp = 255.0;
        }
        if(temp < 0.0){
            temp = 0.0;
        }

        return Math.floor(temp);
    }

    function printZ() {
        let Z = (N * amountOfBlocks) / (((N + amountOfBlocks) * P) * 8 + 2);

        console.log(`Compression ratio: ${Z}\n`);
    }
}

//document.onload(onImageLoad);
img.addEventListener('load', onImageLoad, false);