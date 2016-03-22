import Parallel from 'paralleljs';

class ParallelPi {
    constructor(threads) {
        this.numberOfSteps = 10000000;
        this.threads = threads;
        this.steps = this.createEmptySteps(this.threads);
        this.threadCounter = 0;
        this.threadData = [];

        // Create the parallel instance
        this.p = new Parallel(this.steps, {
            env: { numberOfSteps: this.numberOfSteps }
        });

        this.startTime = Date.now();

        // Loop `this.thread` number of times
        for (let threadCount = 0; threadCount < this.threads; ++threadCount) {

            // Wrap the data with begin and end values
            this.p.then(data => ({
                begin: threadCount === 0 ? 0 : this.numberOfSteps / 2,
                end: threadCount === 0 ? this.numberOfSteps / 2 : this.numberOfSteps,
                data
            }))

            // Spawn the worker
            .spawn(this.calculateSum)
            .then(this.saveResult.bind(this))
            .then(this.checkIfFinished.bind(this));
        }
    }

    calculateSum(block) {
        let sum = 0;
        for(let i = block.begin ; i < block.end ; i++) {
            const x = (i + 0.5) * 1 / global.env.numberOfSteps ;
            sum += 4 / (1 + x * x);
        }
        return sum;
    }

    createEmptySteps(threads) {
        let steps = [];
        for (let i = 0; i < threads - 1; i++) {
            steps.push(0);
        }
        return steps;
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
        if(this.threadCounter === this.threads - 1) {

            // Get the end time by extracting the finish time out of the thread
            // objects and then finding the largest one.
            const endTime = Math.max(...this.threadData.map(thread => thread.finish));

            // Finally, find pi by reducing our thread objects to sum the values
            // and then multiply by 1 over the total step count
            const pi = this.threadData.reduce((previousValue, currentValue) => previousValue.data + currentValue.data) * (1 / this.numberOfSteps);

            console.log(`Value of pi: ${pi} calculated in ${endTime - this.startTime} milliseconds`);
        }

        // If we're not finished, increment the thread counter
        this.threadCounter++;
    }

}

// Instanciate the class with the amount of threads we wish to use
new ParallelPi(2);
