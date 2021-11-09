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
        xSize: 50,
        ySize: 50,
        P: 12,
        error: 600,
    };

    let width = matrix[1].length;
    console.log('width = ' + width);
    let height = matrix.length;
    console.log('height = ' + height);

    // n:
    let n = inputData.xSize;
    console.log('n = ' + n);
    // m:
    let m = inputData.ySize;
    console.log('m = ' + m);
    // Количество нейронов скрытого слоя:
    let p = inputData.P;
    console.log('p = ' + p);
    // Максимально допустимая ошибка:
    let e = inputData.error;
    console.log('e = ' + e);

    // Ширина прямоугольника:
    let w = width / n;
    console.log('w = ' + w);
    // Высота прямоугольника:
    let h = height / m;
    console.log('h = ' + h);

    let S = 3;
    // Количество прямоугольников:
    let L = w * h;
    console.log('L = ' + L);

    // Длина образа:
    let N = n * m * S;
    console.log('N = ' + N);


    let X = [];
    for(let i = 0; i < L; i++) {
        let tempArr = [];
        for(let j = 0; j < N; j++)
            tempArr.push(0);
        X.push(tempArr);
    }
    console.log('X[] length = ' + X.length);
    console.log('X[i] length = ' + X[1].length);

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            for (let i1 = 0; i1 < n; i1++) {
                for (let j1 = 0; j1 < m; j1++) {
                    X[h * i + j][(n * i1 + j1) * S] = (2.0 * matrix[j * m + j1][i * n + i1].red / 255) - 1;
                    X[h * i + j][(n * i1 + j1) * S + 1] = (2.0 * matrix[j * m + j1][i * n + i1].green / 255) - 1;
                    X[h * i + j][(n * i1 + j1) * S + 2] = (2.0 * matrix[j * m + j1][i * n + i1].blue / 255) - 1;
                    //console.log(X[h * i + j][(n * i1 + j1) * S + 2]);
                }
            }
        }
    }
    console.log('X[0][0]  = ' + X[0][0]);
    console.log('X[99][7499]  = ' + X[99][7499]);

    // Создание матрицы весов для первого слоя:
    let W = [];
    for(let i = 0; i < N; i++) {
        let tempArr = [];
        for(let j = 0; j < p; j++)
            tempArr.push((Math.random() - 1) / 5);
        W.push(tempArr);
    }
    console.log('W[0][0]  = ' + W[0][0]);
    console.log('W[2000][5]  = ' + W[2000][5]);
    console.log('W[7499][11]  = ' + W[7499][11]);


    // Нормализация матрицы весов для первого слоя (W):
    for(let i = 0; i < p; i++) {
        let sum = 0;
        for(let j = 0; j < N; j++)
            sum += W[j][i] * W[j][i];
        sum = Math.sqrt(sum);
        for(let j = 0; j < N; j++)
            W[j][i] = W[j][i] / sum;
    }
    console.log('norm W[0][0]  = ' + W[0][0]);
    console.log('norm W[2000][5]  = ' + W[2000][5]);
    console.log('norm W[7499][11]  = ' + W[7499][11]);



}

//document.onload(onImageLoad);
img.addEventListener('load', onImageLoad, false);