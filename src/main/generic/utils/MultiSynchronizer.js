class MultiSynchronizer extends Observable {
    constructor() {
        super();
        /** @type {Map.<string, Synchronizer>} */
        this._synchronizers = new Map();
    }

    /**
     * Push function to the Synchronizer for later, synchronous execution
     * @template T
     * @param {string} tag
     * @param {function():T} fn Function to be invoked later by this Synchronizer
     * @returns {Promise.<T>}
     */
    push(tag, fn) {
        let synchonizer = this._synchronizers.get(tag);
        if (!synchonizer) {
            synchonizer = new Synchronizer();
            synchonizer.on('work-start', () => this.fire('work-start', synchonizer, tag, this));
            synchonizer.on('work-end', () => this.fire('work-end', synchonizer, tag, this));
            this._synchronizers.set(tag, synchonizer);
        }
        return synchonizer.push(fn);
    }

    /**
     * Reject all jobs in the queue and clear it.
     * @returns {void}
     */
    clear() {
        for (const synchronizer of this._synchronizers.values()) {
            synchronizer.clear();
        }
        this._synchronizers.clear();
    }

    /**
     * @param {string} tag
     * @returns {boolean}
     */
    isWorking(tag) {
        const synchonizer = this._synchronizers.get(tag);
        return !!synchonizer && synchonizer.working;
    }
}
Class.register(MultiSynchronizer);
