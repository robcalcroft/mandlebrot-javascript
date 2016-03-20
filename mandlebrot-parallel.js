import Parallel from 'paralleljs';

class ParallelMandlebrot {
    constructor({ size, cutoff, threads }) {
        this.threads = threads;

        // Create an empty set
        const set = this.createMultidimensionalArray(size);

        // Create the parallel instance with the empty set and the env vars so
        // they can be accessed inside the spawned process
        const p = new Parallel(set, {
            env: { size, cutoff, threads }
        });

        // Loop for each thread
        for(let threadCount = 0; threadCount < threads; threadCount++) {
            // Wrap the data with the threadCount then spawn a process
            p.then(set => ({ set, threadCount })).spawn(this.calculateSet);
        }
    }

    createMultidimensionalArray(size) {
        const array = [];
        for (let i = 0; i < size; i++) {
            array.push([]);
        }
        return array;
    }

    done({set, threadCount}) {
        console.log(threadCount);
        if(threadCount === threads - 1) {

        }
    }

    calculateSet({set, threadCount}) {
        //const begin = threadCount === 0 ? 0 : global.env.size / 2;
        //const end = threadCount === 0 ? global.env.size / 2 : global.env.size;

        const blockSize = global.env.size / global.env.threads;

        const begin = threadCount * blockSize;
        const end = begin + blockSize;

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
                if(i === 0 && j === 0) { console.log(j, i, set[2048]);  }
                //if(threadCount===1) { console.log(j, i, set[i]); }
                set[i][j] = k;
            }
        }

        return {set, threadCount};
    }
}

const mandlebrot = new ParallelMandlebrot({
    size: 4096,
    cutoff: 100,
    threads: 2
});
