import Parallel from 'paralleljs';

class ParallelMandelbrot {
    constructor(size, cutoff, threads) {

        // Create the parallel instance with the empty set and the env vars so
        // they can be accessed inside the spawned process
        let startTime = Date.now()
        let data = this.createData(threads, size);
        const p = new Parallel(data, {
            env: { size, cutoff },
            maxWorkers: threads
        });
        const endTime = Date.now()

        console.log(`Set generated in ${endTime - startTime} milliseconds`);

        startTime = Date.now();

        p.map(this.calculateSet).reduce(this.collateData).then(result => {
            console.log(`Calculated in ${result.duration} milliseconds total time taken ${Date.now() - startTime}`);
        });
    }

    createData(threads, size) {
        let array = [];
        let blockSize = size / threads;
        for(let threadCount = 0; threadCount < threads; threadCount++) {
            let begin = threadCount * blockSize;
            let end = begin + blockSize;
            let set = this.createMultidimensionalArray(size);

            array.push([begin, end, set]);
        }
        return array;
    }

    createMultidimensionalArray(size) {
        const array = [];
        for (let i = 0; i < size; i++) {
            let array2 = [];
            for (let j = 0; j < size; j++) {
                array2.push(undefined);
            }
            array.push(array2);
        }
        return array;
    }

    collateData(items) {
        return {
            set: items[0].set.concat(items[1].set),
            duration: items[0].duration + items[1].duration
        };
    }

    calculateSet(element) {
        const begin = element[0];
        const end = element[1];
        let set = element[2];
        console.log('starting thread', begin);
        const startTime = Date.now();

        for(let i = begin ; i < end ; i++) {
            for(let j = 0 ; j < global.env.size ; j++) {

                let cr = (4.0 * i - 2 * global.env.size) / global.env.size;
                let ci = (4.0 * j - 2 * global.env.size) / global.env.size;

                let zr = cr, zi = ci;

                let k = 0;
                while (k < global.env.cutoff && zr * zr + zi * zi < 4.0) {

                    // z = c + z * z

                    let newr = cr + zr * zr - zi * zi;
                    let newi = ci + 2 * zr * zi;

                    zr = newr;
                    zi = newi;

                    k++;
                }
                if(!set[i]) throw new Error(set.length);
                set[i][j] = k;
            }
        }

        const endTime = Date.now();

        return {
            set,
            duration: endTime - startTime
        };
    }
}

const mandelbrot = new ParallelMandelbrot(process.argv[2], 100, process.argv[3]);
