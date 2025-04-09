import { ArgError } from './arg-error';

abstract class BaseEnumValidator<T, ValueType extends T| null | undefined> {
    protected _value: ValueType;
    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    abstract get value(): ValueType;

    default(def :T) : EnumRequiredNotnull<T> {
        if (this.value === null || this.value === undefined) { return new EnumRequiredNotnull(def, this._name); } 
        else { return new EnumRequiredNotnull(this.value, this._name); }
    }
}

export class EnumOptionalNullable<T> extends BaseEnumValidator<T, T | null | undefined> {

    constructor(value: unknown, name: string, values: ReadonlyArray<string>) {
        if (value === undefined || value === null) { super(value, name); }
        else if (Array.isArray(value)) { throw new ArgError('array-not-allowed', name); }
        else if (typeof value === 'object') { throw new ArgError('object-not-allowed', name); }
        else if (values.indexOf(value.toString()) === -1) { throw new ArgError('invalid-key', name); }
        else { super(value as T, name); }
    }

    get value() : T | null | undefined {
        return this._value;
    }

    get required() : EnumRequiredNullable<T> {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new EnumRequiredNullable(this._value, this._name);
    }

    get notnull() : EnumOptionalNotnull<T> {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new EnumOptionalNotnull(this._value, this._name);
    }
}

export class EnumRequiredNullable<T> extends BaseEnumValidator<T, T | null> {

    get value() : T | null {
        return this._value;
    }

    get notnull() : EnumRequiredNotnull<T> {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new EnumRequiredNotnull(this._value, this._name);
    }
}

export class EnumOptionalNotnull<T> extends BaseEnumValidator<T, T | undefined> {

    get value() : T | undefined {
        return this._value;
    }

    get required() : EnumRequiredNotnull<T> {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new EnumRequiredNotnull(this._value, this._name);
    }
}


export class EnumRequiredNotnull<T> extends BaseEnumValidator<T, T> {

    get value() : T {
        return this._value;
    }
}