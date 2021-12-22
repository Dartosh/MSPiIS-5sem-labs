let arr = (): number[][] => {
    let a: number[][] = [];
    for(let i: number = 0; i < 20; i++) {
        let temp: number[] = [];
        for(let j: number = 0; j < 20; j++) {
            temp.push(-1);
        }
        a.push(temp);
    }
    return a;
}

export let initArr = (): number[][][] => {
    let a: number[][][] = [];
    a.push(arr());
    return a;
}

export let addArr = (other: number[][][]): number[][][] => {
    let a: number[][][] = other;
    a.push(arr());
    return a;
}
