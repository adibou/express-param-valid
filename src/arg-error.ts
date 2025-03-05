export class ArgError extends Error {
    field:string;

    constructor(field:string, message:string) {
        super(message);
        this.name = 'ArgError';
        this.field = field;
    }
}