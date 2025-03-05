import { ArgError } from "./arg-error";

abstract class BaseNumberValidator<Self, ValueType extends number | null | undefined> {
    protected _value: ValueType;
    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    max(value:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value > value) { throw new ArgError(this._name, `maximum number size exceeded ${this._value} received instead of ${value}`); }
        return this as unknown as Self;
    }

    min(value:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value < value) { throw new ArgError(this._name, `minimum number size not reached ${this._value} received instead of ${value}`); }
        return this as unknown as Self;
    }

    get positive() { 
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (this.value < 0) { throw new ArgError(this._name, 'number must be positive'); }
        return this as unknown as Self;
    }

    get negative() {
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (this.value > 0) { throw new ArgError(this._name, 'number must be negative'); }
        return this as unknown as Self;
    }

    get integer() {
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (!Number.isSafeInteger(this.value)) { throw new ArgError(this._name, 'number must be integer'); }
        return this as unknown as Self;
    }

    default(def :number) {
        if (this.value === null || this.value === undefined) { new NumberRequiredNotnull(def, this._name); }
        else { return new NumberRequiredNotnull(this.value, this._name); }
    }

    abstract get value(): ValueType;
}

export class NumberOptionalNullable extends BaseNumberValidator<NumberOptionalNullable, number | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); }
        else if (Array.isArray(value)) { throw new ArgError(name, 'array not allowed'); }
        else if (typeof value === 'object') { throw new ArgError(name, 'object not allowed'); }
        const num = Number(value);
        if (isNaN(num)) { throw new ArgError(name, 'number required'); }
        else { super(num, name); }
    }

    get value() : number | null | undefined {
        return this._value;
    }

    get required() : NumberRequiredNullable {
        if(this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new NumberRequiredNullable(this._value, this._name);
    }

    get index() : NumberRequiredNotnull {
        if(this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new NumberRequiredNotnull(this._value, this._name).integer.positive;
    }

    get notnull() : NumberOptionalNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new NumberOptionalNotnull(this._value, this._name);
    }
}

export class NumberRequiredNullable extends BaseNumberValidator<NumberRequiredNullable, number | null> {

    constructor(value: number|null, name: string) {
        super(value, name);
    }

    get value() : number | null {
        return this._value;
    }

    get notnull() : NumberRequiredNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new NumberRequiredNotnull(this._value, this._name);
    }
}

export class NumberOptionalNotnull extends BaseNumberValidator<NumberOptionalNotnull, number | undefined> {

    constructor(value: number|undefined, name: string) {
        super(value, name);
    }

    get value() : number | undefined {
        return this._value;
    }

    get required() : NumberRequiredNotnull {
        if(this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new NumberRequiredNotnull(this._value, this._name);
    }
}


export class NumberRequiredNotnull extends BaseNumberValidator<NumberRequiredNotnull, number> {
    constructor(value: number, name: string) {
        super(value, name);
    }

    get value() : number {
        return this._value;
    }
}




