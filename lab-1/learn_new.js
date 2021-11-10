// ЭТАП 1
// Извлечение значения RGB каждого пикселя

// ПЕРЕМЕННЫЕ И КОНСТАНТЫ
let m;          // Кол-во прямоугольников по-горизонтали
let n;          // Кол-во прямоугольников по-вертикали
let p;          // Количество нейронов скрытого слоя

let e;          // Максимально допустимая ошибка
const S = 3;

let width;      // Ширина изображегтя
let height;     // Высота изображения

let w;          // Ширина прямоугольников
let h;          // Высота прямоугольников

let L;          // Количество прямоугольников
let N;          // Длина образа



let img = new Image(); //Объект типа Image
img.src = './d6.jpg'; //Путь к изображению
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
    let data = imageData.data;

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

            // const color = `${r}-${g}-${b}`;
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
        error: 1000,
    };

    width = canvas.width;
    console.log('width = ' + width);
    height = canvas.height;
    console.log('height = ' + height);

    // n:
    n = inputData.xSize;
    console.log('n = ' + n);
    // m:
    m = inputData.ySize;
    console.log('m = ' + m);
    // Количество нейронов скрытого слоя:
    p = inputData.P;
    console.log('p = ' + p);
    // Максимально допустимая ошибка:
    e = inputData.error;
    console.log('e = ' + e);

    // Ширина прямоугольника:
    w = width / n;
    console.log('w = ' + w);
    // Высота прямоугольника:
    h = height / m;
    console.log('h = ' + h);

    // Количество прямоугольников:
    L = w * h;
    console.log('L = ' + L);

    // Длина образа:
    N = n * m * S;
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
    // console.log('X[0][0]  = ' + X[0][0]);
    // console.log('X[99][7499]  = ' + X[99][7499]);

    // Создание матрицы весов для первого слоя:
    let W = [];
    for(let i = 0; i < N; i++) {
        let tempArr = [];
        for(let j = 0; j < p; j++)
            tempArr.push((Math.random() - 1) / 5);
        W.push(tempArr);
    }
    // console.log('\nW[0][0]  = ' + W[0][0]);
    // console.log('W[2000][5]  = ' + W[2000][5]);
    // console.log('W[7499][11]  = ' + W[7499][11]);


    // Нормализация матрицы весов для первого слоя (W):
    for(let i = 0; i < p; i++) {
        let sum = 0;
        for(let j = 0; j < N; j++)
            sum += W[j][i] * W[j][i];
        sum = Math.sqrt(sum);
        for(let j = 0; j < N; j++)
            W[j][i] = W[j][i] / sum;
    }
    // console.log('norm W[0][0]  = ' + W[0][0]);
    // console.log('norm W[2000][5]  = ' + W[2000][5]);
    // console.log('norm W[7499][11]  = ' + W[7499][11]);

    // Матрица весов на втором слое
    let Wt = [];
    for(let i = 0; i < p; i++) {
        let tempArr = [];
        for(let j = 0; j < N; j++)
            tempArr.push(W[j][i]);
        Wt.push(tempArr);
    }
    // console.log('\nWt[0][0]  = ' + Wt[0][0]);
    // console.log('Wt[5][2000]  = ' + Wt[5][2000]);
    // console.log('Wt[11][7499]  = ' + Wt[11][7499]);

    // Нормализация матрицы Wt
    for(let i = 0; i < N; i++) {
        let sum = 0;
        for(let j = 0; j < p; j++)
            sum += Wt[j][i] * Wt[j][i];
        sum = Math.sqrt(sum);
        for(let j = 0; j < p; j++)
            Wt[j][i] = Wt[j][i] / sum;
    }
    // console.log('Wt[0][0]  = ' + Wt[0][0]);
    // console.log('Wt[5][2000]  = ' + Wt[5][2000]);
    // console.log('Wt[11][7499]  = ' + Wt[11][7499]);

    const STEP_INIT_CONST = 500;
    let Y = [];     // size: p
    let _X = [];    // size: N
    let dX = [];    // size: N
    let Eq = [];    // size: L

    let iterationCount = 0;
    let alphaSecondLayer;

    let E = 0;

    //do {
        E = 0;
        // Обучение сети
        for(let q = 0; q < L; q++) {
            //alphaSecondLayer = 0.001;
            for(let i = 0; i < p; i++)
                Y[i] = 0;
            for(let i = 0; i < N; i++)
                _X[i] = 0;
            for(let i = 0; i < N; i++)
                Eq[q] = 0;

            // Коэффициент обучения для второго слоя:

            alphaSecondLayer = STEP_INIT_CONST;

            for(let i = 0; i < p; i++)
                alphaSecondLayer += (Y[i] * Y[i]);

            alphaSecondLayer = 1 / alphaSecondLayer;


            //let Xq = X[q];
            // let Xq = [];
            // for(let i = 0; i < N; i++)
            //     Xq.push(X[q][i]);
            //Xq[2] = 0;
            // console.log('Xq[2] = ' + Xq[2]);
            // console.log('X[q][2] = ' + X[q][2]);

            for(let i = 0; i < p; i++) {
                for (let j = 0; j < N; j++) {
                    Y[i] += X[q][j] * W[j][i];
                }
            }
            for(let i = 0; i < N; i++) {
                for(let j = 0; j < p; j++) {
                    _X[i] += Y[j] * Wt[j][i];
                }
            }
            for(let i = 0; i < N; i++) {
                dX[i] = _X[i] - X[q][i];
            }

            // Обучение нейровов рецепторного (первого) слоя

            for(let j = 0; j < p; j++) {
                let temp = 0;
                for(let k = 0; k < N; k++) {
                    temp += dX[k] * Wt[j][k];
                }
                for(let i = 0; i < N; i++) {
                    W[i][j] -= (alphaSecondLayer * X[q][i] * temp);
                }
            }

            // Нормализация весов между первым и скрытым слоями

            for(let i = 0; i < p; i++) {
                let sum = 0;
                for (let j = 0; j < N; j++) {
                    sum += W[j][i] * W[j][i];
                }
                sum = Math.sqrt(sum);
                for (let j = 0; j < N; j++) {
                    W[j][i] = W[j][i] / sum;
                }
            }

            // Корректировка весов на втором слое

            for(let i = 0; i < p; i++) {
                for(let j = 0; j < N; j++) {
                    Wt[i][j] -= alphaSecondLayer * Y[i] * dX[j];
                }
            }

            // Нормализация весов между скрытым и выходным слоями

            for(let i = 0; i < N; i++) {
                let sum = 0;
                for (let j = 0; j < p; j++) {
                    sum += Wt[j][i] * Wt[j][i];
                }
                sum = Math.sqrt(sum);
                for(let j = 0; j < p; j++) {
                    Wt[j][i] = Wt[j][i] / sum;
                }
            }
        }

        // Вычисление ошибки

        for(let q = 0; q < L; q++) {
            for(let i = 0; i < p; i++) {
                Y[i] = 0;
            }
            for(let i = 0; i < N; i++) {
                _X[i] = 0;
            }
            // for(let i = 0; i < N; i++) {
            //     Eq[q] = 0;
            // }
            Eq[q] = 0;
            for(let i = 0; i < p; i++) {
                for(let j = 0; j < N; j++) {
                    Y[i] += X[q][j] * W[j][i];
                }
            }
            for(let i = 0; i < N; i++) {
                for(let j = 0; j < p; j++) {
                    _X[i] += Y[j] * Wt[j][i];
                }
            }
            for(let i = 0; i < N; i++) {
                dX[i] = _X[i] - X[q][i];
            }
            for(let i = 0; i < N; i++) {
                Eq[q] += (dX[i] * dX[i]);
            }
        }
        for(let q = 0; q < L; q++) {
            E += Eq[q];
        }

        // for(let i = 0; i < L; i++)
        // {
        //     for(let j = 0; j < N; j++)
        //     {
        //         E += dX[j] * dX[j];
        //     }
        // }

        iterationCount++;

        console.log(`\nIteration: ${iterationCount} | Error: ${E}`);

    //}while(E >= e);

    console.log(`\nFinish error: ${E}\nIterations: ${iterationCount}\nZ: ${(N * L) / ((N + L) * p + 2)}`);


    // Восстановление картинки

    //let data2 = ctx.getImageData(0,0, img.width,img.height);

    //let newData = ctx.createImageData(img.width,img.height);

    console.log(`_X length =  ${_X.length}`);
    for(let q = 0; q < L; q++) {
        for(let i = 0; i < p; i++) {
            Y[i] = 0;
        }
        for(let i = 0; i < N; i++) {
            _X[q] = 0;
        }
        for(let i = 0; i < p; i++) {
            for(let j = 0; j < N; j++) {
                Y[i] += X[q][j] * W[j][i];
            }
        }
        for(let i = 0; i < N; i++) {
            for(let j = 0; j < p; j++) {
                _X[i] += Y[j] * Wt[j][i];
            }
        }
        for(let i = 0; i < n; i++) {
            for(let j = 0; j < m; j++) {
                //const start = 4 * (i * canvas.width + j);
                for(let k = 0; k < 4; k++) {
                    let pixel = Math.floor(255 * ((_X[(n * i + j) * S + k] + 1) / 2));
                    if (pixel > 255) {
                        pixel = 255;
                    }
                    if (pixel < 0) {
                        pixel = 0;
                    }
                    //newData.data[start + k] = pixel;

                }
            }
        }
    }
    //ctx.putImageData(newData,0,0);

    console.log('Finish');
}

//document.onload(onImageLoad);
img.addEventListener('load', onImageLoad, false);