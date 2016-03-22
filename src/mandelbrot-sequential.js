class SequentialMandelbrot {
    constructor({ size, cutoff }) {
        this.set = this.createMultidimensionalArray(size);

        this.calculateSet({size, cutoff});
    }

    createMultidimensionalArray(size) {
        const array = [];
        for (let i = 0; i < size; i++) {
            let array2 = [];
            for (let j = 0; j < size; j++) {
                array2.push([]);
            }
            array.push(array2);
        }
        return array;
    }

    calculateSet({size, cutoff}) {
        const startTime = Date.now();

        for(let i = 0 ; i < size ; i++) {
            for(let j = 0 ; j < size ; j++) {

                let cr = (4.0 * i - 2 * size) / size;
                let ci = (4.0 * j - 2 * size) / size;

                let zr = cr, zi = ci;

                let k = 0;
                while (k < cutoff && zr * zr + zi * zi < 4.0) {

                    // z = c + z * z

                    let newr = cr + zr * zr - zi * zi;
                    let newi = ci + 2 * zr * zi;

                    zr = newr;
                    zi = newi;

                    k++;
                }

                this.set[i] [j] = k;
            }
        }

        const endTime = Date.now();

        console.log(`Calculation completed in ${endTime - startTime} milliseconds`);

        return this.set;
    }
}

const mandelbrot = new SequentialMandelbrot({
    size: 4096,
    cutoff: 100
});
