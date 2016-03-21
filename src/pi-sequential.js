class SequentialPi {
    constructor() {
        this.numberOfSteps = 10000000;
        this.step = 1 / this.numberOfSteps;

        const result = this.calculateSum();

        console.log(`Value of pi: ${result.pi} calculated in ${result.duration} milliseconds`);
    }

    calculateSum() {
        let sum = 0;
        const startTime = Date.now();

        for(let i = 0 ; i < this.numberOfSteps ; i++){
            const x = (i + 0.5) * this.step ;
            sum += 4 / (1 + x * x);
        }

        const endTime = Date.now();

        return {
            duration: endTime - startTime,
            pi: this.step * sum
        };
    }
}

new SequentialPi();
