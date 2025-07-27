export default class FullArgError extends Error {
    field:string;
    code:string;
    errorDetails?:string;
    constructor(code:string, field:string, message:string, errorDetails?:string) {
        super(message);
        this.name = 'ArgError';
        this.field = field;
        this.code = code;
        this.errorDetails = errorDetails;
    }
}

export const errorCodes = {
    'body-undefined': 'The request body is undefined, an object is expected',
    'body-null': 'The request body is null, an object is expected',
    'body-array': 'The request body is an array, an object is expected',

    'undefined-not-allowed': 'The argument is undefined, a value is expected',
    'null-not-allowed': 'The argument is null, a value is expected',
    'array-not-allowed': 'The argument is an array, a value is expected',
    'object-not-allowed': 'The argument is an object, a value is expected',

    'item-array-not-allowed': 'One of the items is an array, a value is expected',
    'item-object-not-allowed': 'One of the items is an object, a value is expected',

    'array-required': 'The argument is not a valid array',
    'object-required': 'The argument is not a valid object',

    'invalid-key' : 'The argument is not a valid key',
    'boolean-required' : 'The argument is not a valid boolean',

    'number-required' : 'The argument is not a valid number',
    'number-not-integer' : 'The argument is not a valid integer',
    'number-min-value' : 'The argument is less than the minimum value',
    'number-max-value' : 'The argument is greater than the maximum value',
    'item-number-required' : 'One of the items is not a valid number',

    'array-min-length': 'The array is too short ',
    'array-max-length': 'The array is too long ',
    'array-not-empty': 'The array is empty, the minimum length is 1',

    'objectid-required': 'The argument is not a valid ObjectId',
    'item-objectid-required': 'One of the items is not a valid ObjectId',

    'string-min-length': 'The string is too short',
    'string-max-length': 'The string is too long',
    'string-contains-uppercase': 'The string must contain at least one uppercase letter',
    'string-contains-lowercase': 'The string must contain at least one lowercase letter',
    'string-contains-number': 'The string must contain at least one number',
    'string-contains-special': 'The string must contain at least one special character',
    'item-string-min-length': 'One of the items is too short',
    'item-string-max-length': 'One of the items is too long',
    'item-email-required': 'One of the items is not a valid email address',
    'email-required': 'The argument is not a valid email address',
    'rpps-required': 'The argument is not a valid RPPS number',
    'iban-required': 'The argument is not a valid IBAN number',
    'nir-required': 'The argument is not a valid NIR number',
    'pattern-not-matching': 'The argument does not match the pattern',
    'item-pattern-not-matching': 'One of the items does not match the pattern',
    'phoneFR-required': 'The argument is not a valid French phone number',
    'date-past': 'The date is in the future',
    'date-future': 'The date is in the past',
    'date-utc-required': 'The date is not in UTC format',
}

export class  ArgError extends FullArgError {
    constructor(code:keyof typeof errorCodes, field?:string, errorDetails?:string) {
        super(code, field || '', errorCodes[code], errorDetails);
    }
}