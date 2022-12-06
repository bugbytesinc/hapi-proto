export class MirrorError extends Error {
    
    readonly status: number;
    readonly innerError: Error | undefined

    constructor(message: string, status: number, innerError: Error | undefined = undefined) {
        super(message);
        Object.setPrototypeOf(this, MirrorError.prototype);
        this.status = status;
        this.innerError = innerError;
    }
}