import Parallel from 'paralleljs';

class PrimeSieveParallel {
    constructor(min, max, threads) {
        this.primeSet = [];
        this.min = min;
        this.max = max;
        this.threadCounter = 0;
        this.threads = threads;

        const blockSize = (max - min) / threads;
        const p = new Parallel(this.createEmptyArray(threads));

        for(let threadCount = 0; threadCount < threads; threadCount++) {
            let threadMin = threadCount * blockSize;
            let threadMax = threadMin + blockSize;

            p.then(data => ({
                data,
                min: threadMin + min, // offsets the min
                max: threadMax + min // offsets the max
            }))
            .spawn(this.findPrimes)
            .then(this.saveResult.bind(this))
            .then(this.checkIfFinished.bind(this));
        }

        //console.log(`${result.primes.length} primes were found between ${min} and ${max} in ${result.duration} milliseconds`);
    }

    createEmptyArray(threads) {
        let array = [];
        for(let i = 0; i < threads; i++) {
            array.push([]);
        }
        return array;
    }

    saveResult(data) {
        this.primeSet.push(data);
    }

    // If all the threads have finished then we can finish
    checkIfFinished() {
        if(this.threadCounter === this.threads - 1) {

            // Sum all the durations via a map reduce
            const duration = this.primeSet.map(element => element.duration).reduce((previous, current) => previous + current);

            // Concatinate all the primes using a map reduce
            const primes = this.primeSet.map(element => element.primes).reduce((previous, current) => previous.concat(current));

            console.log(`${primes.length} primes were found between ${this.min} and ${this.max} in ${duration} milliseconds`);
        }

        // If we're not finished, increment the thread counter
        this.threadCounter++;
    }

    findPrimes({min, max}) {
        /* jshint ignore:start */

        // Sourced from: http://www.javascripter.net/faq/numberisprime.htm
        function leastFactor(n) {
            if (isNaN(n) || !isFinite(n)) return NaN;
            if (n==0) return 0;
            if (n%1 || n*n<2) return 1;
            if (n%2==0) return 2;
            if (n%3==0) return 3;
            if (n%5==0) return 5;
            var m = Math.sqrt(n);
            for (var i=7;i<=m;i+=30) {
                if (n%i==0)      return i;
                if (n%(i+4)==0)  return i+4;
                if (n%(i+6)==0)  return i+6;
                if (n%(i+10)==0) return i+10;
                if (n%(i+12)==0) return i+12;
                if (n%(i+16)==0) return i+16;
                if (n%(i+22)==0) return i+22;
                if (n%(i+24)==0) return i+24;
            }
            return n;
        }

        function isPrime(n) {
            if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false;
            if (n == leastFactor(n)) return true;
            return false;
        }

        /* jshint ignore:end */
        console.log('stared thread', Date.now());
        let primes = [];

        const startTime = Date.now();

        for(let potentialPrime = min; potentialPrime < max; potentialPrime++) {
            if(isPrime(potentialPrime)) {
                const confirmedPrime = potentialPrime;
                primes.push(confirmedPrime);
            }
        }

        const endTime = Date.now();

        return {
            primes,
            duration: endTime - startTime
        };
    }
}

new PrimeSieveParallel(0, 10000000, 4);
