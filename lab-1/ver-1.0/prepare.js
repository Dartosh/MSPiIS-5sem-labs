import { inputData, canvas, matrix } from './learn';
const RAND_MAX = 2147483647;

// Размеры матрицы
const matrixWidth = canvas.width;
const matrixHeight = canvas.height;

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
let N = rectangleWidth * rectangleHeight * 3;

// Координаты блока
let blockNumberIntoX = 0;
let blockNumberIntoY = 0;

// Номер цвета
let colorNumber;

// Матрица с преобразованными значениями RGB
let X = [];

let nextX = [];
let deltaX = [];

let multiDX = [];

let Y = [];


for(let g = 0; g < amountOfBlocks; g++) {
    colorNumber = 0;
    let subX = [];
    for(let i = blockNumberIntoY * rectangleHeight; i < (blockNumberIntoY + 1) * rectangleHeight; i++) {

        for(let j = blockNumberIntoX * rectangleWidth; j < (blockNumberIntoX + 1) * rectangleWidth; j++) {
            subX.push((2 * (matrix[i][j].red / 255.0)) - 1);
            subX.push((2 * (matrix[i][j].green / 255.0)) - 1);
            subX.push((2 * (matrix[i][j].blue / 255.0)) - 1);
        }
    }
    X.push(subX);

    blockNumberIntoX++;

    if(blockNumberIntoX >= Math.floor(matrixWidth / rectangleWidth))
    {
        blockNumberIntoX = 0;
        blockNumberIntoY++;
    }
}

// Массив Весов
let W = [];
let nextW = [];

configureCoefficientArray();

let amountOfIterations = 0;

// Шаги обучения двух весовых матриц
let nextAlpha, alpha;

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

        alpha = countAlpha(i); // вычисление адаптивного шага

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

module.exports = matrixRGB;

function checkE(e) {
    let E = 0.0;
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
        nextX[blockNumber][i] = 0.0;
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

function configureCoefficientArray() {
    // Задается первая весовая матрица
    for(let i = 0; i < N; i++)
    {
        let subW = [];
        for(let j = 0; j < P; j++)
        {
            subW = (Math.random() * RAND_MAX) / RAND_MAX; // Задаём рандомные веса
        }
        W.push(subW);
    }


    for(let i = 0; i < N; i++)
    {
        for(let j = 0; j < P; j++)
        {
            nextW[j][i] = W[i][j]; // Транспонируем матрицу весов
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