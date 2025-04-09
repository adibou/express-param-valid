import { ArgError } from './arg-error';

abstract class BaseStringArrayValidator<Self, ValueType extends string[] | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    max(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val.length > length) { throw new ArgError('array-max-length', this._name, length.toString()); }
        });
        return this as unknown as Self;
    }

    min(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val.length < length) { throw new ArgError('array-min-length', this._name, length.toString()); }
        });
        return this as unknown as Self;
    }

    get trim() : Self { 
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value = this._value.map(val => val.trim()) as unknown as ValueType;
        return this as unknown as Self;
    }

    get notEmpty() : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val === '') { throw new ArgError('array-not-empty', this._name); }
        });
        return this as unknown as Self;
    }

    get email() : Self  {
        if (this._value === null || this._value === undefined) { return this  as unknown as Self; }
        this._value.forEach(val => {
            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val)) {  throw new ArgError('item-email-required', this._name); }
        });
        return this as unknown as Self;
    }

    pattern( pattern:RegExp) {
        if (this._value === null || this._value === undefined) { return this; }
        this._value.forEach(val => {
            if (!pattern.test(val)) { throw new ArgError('item-pattern-not-matching', this._name); }
        });
        return this;
    }

    default(def :string[]) {
        if (this._value === null || this._value === undefined) { return new StringArrayRequiredNotnull(def, this._name); } else { return new StringArrayRequiredNotnull(this._value, this._name); }
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

export class StringArrayOptionalNullable extends BaseStringArrayValidator<StringArrayOptionalNullable, string[] | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (!Array.isArray(value)) { throw new ArgError('array-required', name); }
        else {
            const arr:string[] = [];
            value.filter(v => v !== null && v !== undefined).forEach(v => {
                if (Array.isArray(v)) { throw new ArgError('item-array-not-allowed', name); }
                if (typeof v === 'object') { throw new ArgError('item-object-not-allowed', name); }
                arr.push(v.toString());
            });
            super(arr, name);
        }
    }

    get value() : string[] | null | undefined {
        return this._value;
    }

    get required() : StringArrayRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new StringArrayRequiredNullable(this._value, this._name);
    }

    get notnull() : StringArrayOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new StringArrayOptionalNotnull(this._value, this._name);
    }
}

export class StringArrayRequiredNullable extends BaseStringArrayValidator<StringArrayRequiredNullable, string[] | null> {

    get value() : string[] | null {
        return this._value;
    }

    get notnull() : StringArrayRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new StringArrayRequiredNotnull(this._value, this._name);
    }
}

export class StringArrayOptionalNotnull extends BaseStringArrayValidator<StringArrayOptionalNotnull, string[] | undefined> {

    get value() : string[] | undefined {
        return this._value;
    }

    get required() : StringArrayRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new StringArrayRequiredNotnull(this._value, this._name);
    }
}


export class StringArrayRequiredNotnull extends BaseStringArrayValidator<StringArrayRequiredNotnull, string[]> {

    get value() : string[] {
        return this._value;
    }
}