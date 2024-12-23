class RequestManager {
    static requestQueue = []; // Shared request queue across all instances
    static pendingRequestPromises = []; // Shared in-progress promises array

    constructor(concurrentLimit = 4) {
        this.concurrentLimit = concurrentLimit;
    }

    // Add a new request to the queue with an optional priority
    addRequest(requestFn, priority = Infinity) {
        return new Promise((resolve, reject) => {
            RequestManager.requestQueue.push({ requestFn, priority, resolve, reject });
            RequestManager.requestQueue.sort((a, b) => a.priority - b.priority); // Sort by priority
            this.processQueue();
        });
    }

    // Process the queue
    async processQueue() {
        while (RequestManager.pendingRequestPromises.length < this.concurrentLimit && RequestManager.requestQueue.length > 0) {
            const { requestFn, resolve, reject } = RequestManager.requestQueue.shift(); // Dequeue the next request
            const promise = this.executeRequest(requestFn);

            RequestManager.pendingRequestPromises.push(promise);

            promise
                .then(resolve)
                .catch((error) => {
                    // console.error("Error in request:", error);
                    reject(error); // Explicitly reject to handle failure in addRequest's promise
                })
                .finally(() => {
                    RequestManager.pendingRequestPromises = RequestManager.pendingRequestPromises.filter(p => p !== promise);
                    this.processQueue(); // Check for new requests after this one finishes
                });
        }
    }

    // Execute the request
    async executeRequest(requestFn) {
        try {
            return await requestFn();
        } catch (error) {
            console.error("Request failed:", error);
            throw error; // Throw error so it propagates up to processQueue
        }
    }
}

export default RequestManager;
