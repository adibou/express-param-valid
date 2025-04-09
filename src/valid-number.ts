import { ArgError } from './arg-error';

abstract class BaseNumberValidator<Self, ValueType extends number | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    max(value:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value > value) { throw new ArgError('number-max-value', this._name, value.toString()); }
        return this as unknown as Self;
    }

    min(value:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value < value) { throw new ArgError('number-min-value', this._name, value.toString()); }
        return this as unknown as Self;
    }

    get positive() { 
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (this.value < 0) { throw new ArgError('number-min-value', this._name, '0'); }
        return this as unknown as Self;
    }

    get negative() {
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (this.value > 0) { throw new ArgError('number-max-value', this._name, '0'); }
        return this as unknown as Self;
    }

    get integer() {
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (!Number.isSafeInteger(this.value)) { throw new ArgError('number-not-integer', this._name); }
        return this as unknown as Self;
    }

    default(def :number) : NumberRequiredNotnull {
        if (this.value === null || this.value === undefined) { return new NumberRequiredNotnull(def, this._name); } 
        else { return new NumberRequiredNotnull(this.value, this._name); }
    }

    abstract get value(): ValueType;
}

export class NumberOptionalNullable extends BaseNumberValidator<NumberOptionalNullable, number | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (Array.isArray(value)) { throw new ArgError('array-not-allowed', name); }
        else if (typeof value === 'object') { throw new ArgError('object-not-allowed', name); }
        else {
            const num = Number(value);
            if (isNaN(num)) { throw new ArgError('number-required', name); }
            else { super(num, name); }
        }
    }

    get value() : number | null | undefined {
        return this._value;
    }

    get required() : NumberRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new NumberRequiredNullable(this._value, this._name);
    }

    get index() : NumberRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new NumberRequiredNotnull(this._value, this._name).integer.positive;
    }

    get notnull() : NumberOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new NumberOptionalNotnull(this._value, this._name);
    }
}

export class NumberRequiredNullable extends BaseNumberValidator<NumberRequiredNullable, number | null> {

    get value() : number | null {
        return this._value;
    }

    get notnull() : NumberRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new NumberRequiredNotnull(this._value, this._name);
    }
}

export class NumberOptionalNotnull extends BaseNumberValidator<NumberOptionalNotnull, number | undefined> {

    get value() : number | undefined {
        return this._value;
    }

    get required() : NumberRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new NumberRequiredNotnull(this._value, this._name);
    }
}


export class NumberRequiredNotnull extends BaseNumberValidator<NumberRequiredNotnull, number> {

    get value() : number {
        return this._value;
    }
}




