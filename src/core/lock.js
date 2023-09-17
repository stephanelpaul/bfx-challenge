class Lock {
    constructor() {
        this.isLocked = false;
    }

    async acquire() {
        while(this.isLocked) {
            await new Promise(resolve => setTimeout(resolve, 10))
        }

        this.isLocked = true;
    }

    release() {
        this.isLocked = false;
    }
}

module.exports = Lock;