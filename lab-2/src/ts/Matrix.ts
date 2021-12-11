export default class Matrix {

    static transpose(matrix: number[][]) {
        let transposeMatrix: number[][] = [];

        for (let i = 0; i < matrix.length; i++) {

            for (let j = 0; j < matrix[i].length; j++) {
                if (!transposeMatrix[j]) {
                    transposeMatrix[j] = [];
                }

                transposeMatrix[j][i] = matrix[i][j];
            }
        }

        return transposeMatrix;
    }

    static normalize(matrix: number[][]) {
        let normalizeMatrix: number[][] = [];

        for (let j = 0; j < matrix[0].length; j++) {
            let sum: number = 0;

            for (let i = 0; i < matrix.length; i++) {
                if (!normalizeMatrix[i]) {
                    normalizeMatrix[i] = [];
                }

                sum += Math.pow(matrix[i][j], 2);
            }

            sum = Math.sqrt(sum);

            for (let i = 0; i < matrix.length; i++) {
                normalizeMatrix[i][j] = matrix[i][j] / sum;
            }
        }

        return normalizeMatrix;
    }

    static multipleMatrix(matrix1: number[][], matrix2: number[][]) {
        let resultMatrix: number[][] = [];

        for (let i = 0; i < matrix1.length; i++) {
            resultMatrix[i] = [];

            for (let j = 0; j < matrix2[0].length; j++) {
                resultMatrix[i][j] = 0;

                for (let k = 0; k < matrix2.length; k++) {
                    resultMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
                }
            }

        }

        return resultMatrix;
    }

    static multipleSkalar(matrix: number[][], multiplier: number) {
        let resultMatrix: number[][] = [];

        for (let i = 0; i < matrix.length; i++) {
            resultMatrix[i] = [];

            for (let j = 0; j < matrix[i].length; j++) {
                resultMatrix[i][j] = matrix[i][j] * multiplier;
            }
        }

        return resultMatrix;
    }

    static minus(matrix1: number[][], matrix2: number[][]) {
        let resultMatrix: number[][] = [];

        for (let i = 0; i < matrix1.length; i++) {
            resultMatrix[i] = [];

            for (let j = 0; j < matrix1[i].length; j++) {
                resultMatrix[i][j] = matrix1[i][j] - matrix2[i][j];
            }
        }

        return resultMatrix;
    }

    static sum(matrix1: number[][], matrix2: number[][]) {
        let resultMatrix: number[][] = [];

        for (let i = 0; i < matrix1.length; i++) {
            resultMatrix[i] = [];

            for (let j = 0; j < matrix1[i].length; j++) {
                resultMatrix[i][j] = matrix1[i][j] + matrix2[i][j];
            }
        }

        return resultMatrix;
    }

    static vectorSum(matrix: number[][]) {
        if (matrix.length > 1) {
            return 0;
        }

        let sum: number = 1;

        for (let i = 0; i < matrix[0].length; i++) {
            sum += Math.pow(matrix[0][i], 2);
        }

        return sum;
    }

}