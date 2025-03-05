import { ArgError } from "./arg-error";

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
            if (val > length) { throw new ArgError(this._name, `maximum exceeded ${val} received instead of ${length}`); }
        });
        return this as unknown as Self;
    }

    min(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val < length) { throw new ArgError(this._name, `minimum not reached ${val} received instead of ${length}`); }
        });
        return this as unknown as Self;
    }

    get positive() { 
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val < 0) { throw new ArgError(this._name, 'number must be positive'); }
        });
        return this as unknown as Self;
    }

    get negative() {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val > 0) { throw new ArgError(this._name, 'number must be negative'); }
        });
        return this as unknown as Self;
    }

    get integer() {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (!Number.isSafeInteger(val)) { throw new ArgError(this._name, 'number must be integer'); }
        });
        return this as unknown as Self;
    }

    default(def :number[]) {
        if (this._value === null || this._value === undefined) { return new NumberArrayRequiredNotnull(def, this._name); }
        else { return new NumberArrayRequiredNotnull(this._value, this._name); }
    }

    maxArrayLength(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length > length) { throw new ArgError(this._name, `maximum array length exceeded ${this._value.length} received instead of ${length}`); }
        return this as unknown as Self;
    }

    minArrayLength(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length < length) { throw new ArgError(this._name, `minimum array length not reached ${this._value.length} received instead of ${length}`); }
        return this as unknown as Self;
    }

    get notEmptyArray() : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length === 0) { throw new ArgError(this._name, 'empty array not autorized'); }
        return this as unknown as Self;
    }

    get trimArray() : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value = this._value.filter(v => v !== undefined && v !== null) as unknown as ValueType;
        return this as unknown as Self
    }

    abstract get value(): ValueType;
}

export class NumberArrayOptionalNullable extends BaseNumberArrayValidator<NumberArrayOptionalNullable, number[] | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); }
        else if (!Array.isArray(value)) { throw new ArgError(name, 'array required'); }
        else { super(value, name); }
    }

    get value() : number[] | null | undefined {
        return this._value;
    }

    get required() : NumberArrayRequiredNullable {
        if(this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new NumberArrayRequiredNullable(this._value, this._name);
    }

    get notnull() : NumberArrayOptionalNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new NumberArrayOptionalNotnull(this._value, this._name);
    }
}

export class NumberArrayRequiredNullable extends BaseNumberArrayValidator<NumberArrayRequiredNullable, number[] | null> {

    constructor(value: number[]|null, name: string) {
        super(value, name);
    }

    get value() : number[] | null {
        return this._value;
    }

    get notnull() : NumberArrayRequiredNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new NumberArrayRequiredNotnull(this._value, this._name);
    }
}

export class NumberArrayOptionalNotnull extends BaseNumberArrayValidator<NumberArrayOptionalNotnull, number[] | undefined> {

    constructor(value: number[]|undefined, name: string) {
        super(value, name);
    }

    get value() : number[] | undefined {
        return this._value;
    }

    get required() : NumberArrayRequiredNotnull {
        if(this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new NumberArrayRequiredNotnull(this._value, this._name);
    }
}


export class NumberArrayRequiredNotnull extends BaseNumberArrayValidator<NumberArrayRequiredNotnull, number[]> {

    constructor(value: number[], name: string) {
        super(value, name);
    }

    get value() : number[] {
        return this._value;
    }
}