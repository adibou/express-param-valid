import ArgError from './arg-error';

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
        else if (Array.isArray(value)) { throw new ArgError(name, 'string required but array received'); }
        else if (typeof value === 'object') { throw new ArgError(name, 'string required but object received'); }
        else if (values.indexOf(value.toString()) === -1) { throw new ArgError(name, 'invalid key'); }
        else { super(value as T, name); }
    }

    get value() : T | null | undefined {
        return this._value;
    }

    get required() : EnumRequiredNullable<T> {
        if (this._value === undefined) { throw new ArgError(this._name, 'udefined not allowed'); }
        return new EnumRequiredNullable(this._value, this._name);
    }

    get notnull() : EnumOptionalNotnull<T> {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new EnumOptionalNotnull(this._value, this._name);
    }
}

export class EnumRequiredNullable<T> extends BaseEnumValidator<T, T | null> {

    get value() : T | null {
        return this._value;
    }

    get notnull() : EnumRequiredNotnull<T> {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new EnumRequiredNotnull(this._value, this._name);
    }
}

export class EnumOptionalNotnull<T> extends BaseEnumValidator<T, T | undefined> {

    get value() : T | undefined {
        return this._value;
    }

    get required() : EnumRequiredNotnull<T> {
        if (this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new EnumRequiredNotnull(this._value, this._name);
    }
}


export class EnumRequiredNotnull<T> extends BaseEnumValidator<T, T> {

    get value() : T {
        return this._value;
    }
}