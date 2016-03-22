import Parallel from 'paralleljs';

class ParallelMandelbrot {
    constructor({ size, cutoff, threads }) {
        this.threads = threads;
        this.threadCounter = 0;
        this.threadData = [];
        this.size = size;

        // Create an empty set
        const set = this.createMultidimensionalArray(size);

        // Create the parallel instance with the empty set and the env vars so
        // they can be accessed inside the spawned process
        this.p = new Parallel(set, {
            env: { size, cutoff }
        });

        this.startTime = Date.now();

        // Loop `this.thread` number of times
        for (let threadCount = 0; threadCount < this.threads; ++threadCount) {

            // Wrap the data with begin and end values
            this.p.then(set => ({
                begin: threadCount === 0 ? 0 : this.size / 2,
                end: threadCount === 0 ? this.size / 2 : this.size,
                set: threadCount === 0 ? set.slice(0, a.length/2) : set.slice(a.length/2)
            }))

            // Spawn the worker
            .spawn(this.calculateSet)
            .then(this.saveResult.bind(this))
            .then(this.checkIfFinished.bind(this));
        }
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

    calculateSet({begin, end, set}) {
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

                set[i] [j] = k;
            }
        }

        return set;
    }

    // Save the data and the end time, we calculate the longest end time at
    // the end which becomes the final end time.
    saveResult(data) {
        this.threadData.push({
            data,
            finish: Date.now()
        });
    }

    // If all the threads have finished then we can finish
    checkIfFinished() {
        console.log('thread finised');
        if(this.threadCounter === this.threads - 1) {

            // Get the end time by extracting the finish time out of the thread
            // objects and then finding the largest one.
            const endTime = Math.max(...this.threadData.map(thread => thread.finish));
            console.log(...this.threadData.map(thread => thread.data));

            console.log(`Finished in ${endTime - this.startTime}`);
        }

        // If we're not finished, increment the thread counter
        this.threadCounter++;
    }
}

const mandelbrot = new ParallelMandelbrot({
    size: 512,
    cutoff: 100,
    threads: 2
});
