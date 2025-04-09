import { ArgError } from './arg-error';

abstract class BasePasswordValidator<Self, ValueType extends string | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    length(min:number | undefined, max:number | undefined) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (min !== undefined && this._value.length < min) { throw new ArgError('string-min-length', this._name, min.toString()); }
        if (max !== undefined && this._value.length > max) { throw new ArgError('string-max-length', this._name, max.toString()); }
        return this as unknown as Self;
    }

    max(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length > length) { throw new ArgError('string-max-length', this._name, length.toString()); }
        return this as unknown as Self;
    }

    min(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length < length) { throw new ArgError('string-min-length', this._name, length.toString()); }
        return this as unknown as Self;
    }

    get trim() { 
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        this._value = this.value.trim() as unknown as ValueType;
        return this as unknown as Self;
    }

    get notEmpty() {
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (this.value === '') { throw new ArgError('string-min-length', this._name, '1'); }
        return this as unknown as Self;
    }

    get upperCase() {
        if (this.value === null || this.value === undefined) { return this; }
        if (!/[A-Z]/.test(this.value)) { throw new ArgError('string-contains-uppercase', this._name); }
        return this;
    }

    get lowerCase() {
        if (this.value === null || this.value === undefined) { return this; }
        if (!/[a-z]/.test(this.value)) { throw new ArgError('string-contains-lowercase', this._name); }
        return this;
    }

    get number() {
        if (this.value === null || this.value === undefined) { return this; }
        if (!/[0-9]/.test(this.value)) { throw new ArgError('string-contains-number', this._name); }
        return this;
    }


    abstract get value(): ValueType;
}

export class PasswordOptionalNullable extends BasePasswordValidator<PasswordOptionalNullable, string | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (Array.isArray(value)) { throw new ArgError('array-not-allowed', name); }
        else if (typeof value === 'object') { throw new ArgError('object-not-allowed', name); }
        else { super(value.toString(), name); }
    }

    get value() : string | null | undefined {
        return this._value;
    }

    get required() : PasswordRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new PasswordRequiredNullable(this._value, this._name);
    }

    get notnull() : PasswordOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new PasswordOptionalNotnull(this._value, this._name);
    }
}

export class PasswordRequiredNullable extends BasePasswordValidator<PasswordRequiredNullable, string | null> {

    get value() : string | null {
        return this._value;
    }

    get notnull() : PasswordRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new PasswordRequiredNotnull(this._value, this._name);
    }
}

export class PasswordOptionalNotnull extends BasePasswordValidator<PasswordOptionalNotnull, string | undefined> {

    get value() : string | undefined {
        return this._value;
    }

    get required() : PasswordRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new PasswordRequiredNotnull(this._value, this._name);
    }
}


export class PasswordRequiredNotnull extends BasePasswordValidator<PasswordRequiredNotnull, string> {
    get value() : string {
        return this._value;
    }
}