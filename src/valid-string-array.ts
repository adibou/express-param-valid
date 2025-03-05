import { ArgError } from "./arg-error";

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
            if (val.length > length) { throw new ArgError(this._name, `maximum string size exceeded ${val.length} received instead of ${length}`); }
        });
        return this as unknown as Self;
    }

    min(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        this._value.forEach(val => {
            if (val.length < length) { throw new ArgError(this._name, `minimum string size not reached ${val.length} received instead of ${length}`); }
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
            if (val === '') { throw new ArgError(this._name, 'empty string not autorized'); }
        })
        return this as unknown as Self;
    }

    get email() : Self  {
        if (this._value === null || this._value === undefined) { return this  as unknown as Self; }
        this._value.forEach(val => {
            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val)) {  throw new ArgError(this._name, 'email invalid'); }
        });
        return this as unknown as Self;
    }

    pattern( pattern:RegExp) {
        if (this._value === null || this._value === undefined) { return this; }
        this._value.forEach(val => {
            if (!pattern.test(val)) { throw new ArgError(this._name, 'pattern not matching'); }
        });
        return this;
    }

    default(def :string[]) {
        if (this._value === null || this._value === undefined) { return new StringArrayRequiredNotnull(def, this._name); }
        else { return new StringArrayRequiredNotnull(this._value, this._name); }
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
        this._value = this._value.filter(v => v !== undefined && v !== null && v.trim() !== '') as unknown as ValueType;
        return this as unknown as Self
    }

    abstract get value(): ValueType;
}

export class StringArrayOptionalNullable extends BaseStringArrayValidator<StringArrayOptionalNullable, string[] | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); }
        else if (!Array.isArray(value)) { throw new ArgError(name, 'string array required'); }
        else { super(value, name); }
    }

    get value() : string[] | null | undefined {
        return this._value;
    }

    get required() : StringArrayRequiredNullable {
        if(this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new StringArrayRequiredNullable(this._value, this._name);
    }

    get notnull() : StringArrayOptionalNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new StringArrayOptionalNotnull(this._value, this._name);
    }
}

export class StringArrayRequiredNullable extends BaseStringArrayValidator<StringArrayRequiredNullable, string[] | null> {

    constructor(value: string[]|null, name: string) {
        super(value, name);
    }

    get value() : string[] | null {
        return this._value;
    }

    get notnull() : StringArrayRequiredNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new StringArrayRequiredNotnull(this._value, this._name);
    }
}

export class StringArrayOptionalNotnull extends BaseStringArrayValidator<StringArrayOptionalNotnull, string[] | undefined> {

    constructor(value: string[]|undefined, name: string) {
        super(value, name);
    }

    get value() : string[] | undefined {
        return this._value;
    }

    get required() : StringArrayRequiredNotnull {
        if(this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new StringArrayRequiredNotnull(this._value, this._name);
    }
}


export class StringArrayRequiredNotnull extends BaseStringArrayValidator<StringArrayRequiredNotnull, string[]> {

    constructor(value: string[], name: string) {
        super(value, name);
    }

    get value() : string[] {
        return this._value;
    }
}