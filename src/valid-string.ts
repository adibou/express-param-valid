import { ArgError } from "./arg-error";

abstract class BaseStringValidator<Self, ValueType extends string | null | undefined> {
    protected _value: ValueType;
    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    length(min:number|undefined, max:number|undefined) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (min !== undefined && this._value.length < min) { throw new ArgError(this._name, `minimum string size not reached ${this._value.length} received instead of ${min}`); }
        if (max !== undefined && this._value.length > max) { throw new ArgError(this._name, `maximum string size exceeded ${this._value.length} received instead of ${max}`); }
        return this as unknown as Self;
    }

    maxLength(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length > length) { throw new ArgError(this._name, `maximum string size exceeded ${this._value.length} received instead of ${length}`); }
        return this as unknown as Self;
    }

    minLength(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length < length) { throw new ArgError(this._name, `minimum string size not reached ${this._value.length} received instead of ${length}`); }
        return this as unknown as Self;
    }

    get trim() { 
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        this._value = this.value.trim() as unknown as ValueType;
        return this as unknown as Self;
    }

    get notEmpty() {
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (this.value === '') { throw new ArgError(this._name, 'empty string not autorized'); }
        return this as unknown as Self;
    }

    get email() {
        if (this.value === null || this.value === undefined) { return this; }
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.value)) {  throw new ArgError(this._name, 'email invalid'); }
        return this;
    }

    pattern( pattern:RegExp) {
        if (this.value === null || this.value === undefined) { return this; }
        if (!pattern.test(this.value)) { throw new ArgError(this._name, 'pattern not matching'); }
        return this;
    }

    default(def :string) {
        if (this.value === null || this.value === undefined) { return new StringRequiredNotnull(def, this._name); }
        else { return new StringRequiredNotnull(this.value, this._name); }
    }


    abstract get value(): ValueType;
}

export class StringOptionalNullable extends BaseStringValidator<StringOptionalNullable, string | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); }
        else if (Array.isArray(value)) { throw new ArgError(name, 'string required but array received'); }
        else if (typeof value === 'object') { throw new ArgError(name, 'string required but object received'); }
        else { super(value.toString(), name); }
    }

    get value() : string | null | undefined {
        return this._value;
    }

    get required() : StringRequiredNullable {
        if(this._value === undefined) { throw new ArgError(this._name, 'string required but undefined recieved'); }
        return new StringRequiredNullable(this._value, this._name);
    }

    get notnull() : StringOptionalNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'string required but null recieved'); }
        return new StringOptionalNotnull(this._value, this._name);
    }
}

export class StringRequiredNullable extends BaseStringValidator<StringRequiredNullable, string | null> {

    constructor(value: string|null, name: string) {
        super(value, name);
    }

    get value() : string | null {
        return this._value;
    }

    get notnull() : StringRequiredNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'string required but null recieved'); }
        return new StringRequiredNotnull(this._value, this._name);
    }
}

export class StringOptionalNotnull extends BaseStringValidator<StringOptionalNotnull, string | undefined> {

    constructor(value: string|undefined, name: string) {
        super(value, name);
    }

    get value() : string | undefined {
        return this._value;
    }

    get required() : StringRequiredNotnull {
        if(this._value === undefined) { throw new ArgError(this._name, 'string required but undefined recieved'); }
        return new StringRequiredNotnull(this._value, this._name);
    }
}


export class StringRequiredNotnull extends BaseStringValidator<StringRequiredNotnull, string> {

    constructor(value: string, name: string) {
        super(value, name);
    }

    get value() : string {
        return this._value;
    }
}