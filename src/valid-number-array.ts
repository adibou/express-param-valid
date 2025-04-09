import { ArgError } from './arg-error';

abstract class BaseNumberArrayValidator<Self, ValueType extends number[] | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    max(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val > length) { throw new ArgError('number-max-value', this._name, length.toString()); }
        });
        return this as unknown as Self;
    }

    min(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val < length) { throw new ArgError('number-min-value', this._name, length.toString()); }
        });
        return this as unknown as Self;
    }

    get positive() { 
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val < 0) { throw new ArgError('number-min-value', this._name, '0'); }
        });
        return this as unknown as Self;
    }

    get negative() {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val > 0) { throw new ArgError('number-max-value', this._name, '0'); }
        });
        return this as unknown as Self;
    }

    get integer() {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (!Number.isSafeInteger(val)) { throw new ArgError('number-not-integer', this._name); }
        });
        return this as unknown as Self;
    }

    default(def :number[]) {
        if (this._value === null || this._value === undefined) { return new NumberArrayRequiredNotnull(def, this._name); } else { return new NumberArrayRequiredNotnull(this._value, this._name); }
    }

    maxArrayLength(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length > length) { throw new ArgError('array-max-length', this._name, length.toString()); }
        return this as unknown as Self;
    }

    minArrayLength(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length < length) { throw new ArgError('array-min-length', this._name, length.toString()); }
        return this as unknown as Self;
    }

    get notEmptyArray() : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length === 0) { throw new ArgError('array-not-empty', this._name); }
        return this as unknown as Self;
    }

    abstract get value(): ValueType;
}

export class NumberArrayOptionalNullable extends BaseNumberArrayValidator<NumberArrayOptionalNullable, number[] | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (!Array.isArray(value)) { throw new ArgError('array-required', name); }
        else { 
            const arr:number[] = [];
            value.filter(v => v !== null && v !== undefined).forEach(v => {
                if (Array.isArray(v)) { throw new ArgError('item-array-not-allowed', name); }
                if (typeof v === 'object') { throw new ArgError('item-object-not-allowed', name); }
                const num = Number(value);
                if (isNaN(num)) { throw new ArgError('item-number-required', name); }
                arr.push(num);
            });
            super(arr, name);
        }
    }

    get value() : number[] | null | undefined {
        return this._value;
    }

    get required() : NumberArrayRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new NumberArrayRequiredNullable(this._value, this._name);
    }

    get notnull() : NumberArrayOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }   
        return new NumberArrayOptionalNotnull(this._value, this._name);
    }
}

export class NumberArrayRequiredNullable extends BaseNumberArrayValidator<NumberArrayRequiredNullable, number[] | null> {

    get value() : number[] | null {
        return this._value;
    }

    get notnull() : NumberArrayRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new NumberArrayRequiredNotnull(this._value, this._name);
    }
}

export class NumberArrayOptionalNotnull extends BaseNumberArrayValidator<NumberArrayOptionalNotnull, number[] | undefined> {

    get value() : number[] | undefined {
        return this._value;
    }

    get required() : NumberArrayRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new NumberArrayRequiredNotnull(this._value, this._name);
    }
}


export class NumberArrayRequiredNotnull extends BaseNumberArrayValidator<NumberArrayRequiredNotnull, number[]> {

    get value() : number[] {
        return this._value;
    }
}