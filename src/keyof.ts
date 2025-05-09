import { ArgError } from './arg-error';

abstract class BaseKeyOfValidator<ValueType extends string| null | undefined> {
    protected _value: ValueType;

    protected _name: string;


    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    abstract get value(): ValueType;
}

export class KeyOfOptionalNullable extends BaseKeyOfValidator<string | null | undefined> {

    constructor(value: unknown, name: string, obj: Record<string, any>) {
        if (value === undefined || value === null) { super(value, name); }
        else if (Array.isArray(value)) { throw new ArgError('array-not-allowed', name); }
        else if (typeof value === 'object') { throw new ArgError('object-not-allowed', name); }
        else if (Object.keys(obj).indexOf(value.toString()) === -1) { throw new ArgError('invalid-key', name); }
        else { super(value.toString(), name); }
    }


    get value() : string | null | undefined {
        return this._value;
    }

    get required() : KeyOfRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new KeyOfRequiredNullable(this._value, this._name);
    }

    get notnull() : KeyOfOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new KeyOfOptionalNotnull(this._value, this._name);
    }
}

export class KeyOfRequiredNullable extends BaseKeyOfValidator<string | null> {

    get value() : string | null {
        return this._value;
    }

    get notnull() : KeyOfRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new KeyOfRequiredNotnull(this._value, this._name);
    }
}

export class KeyOfOptionalNotnull extends BaseKeyOfValidator<string | undefined> {

    get value() : string | undefined {
        return this._value;
    }

    get required() : KeyOfRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new KeyOfRequiredNotnull(this._value, this._name);
    }
}


export class KeyOfRequiredNotnull extends BaseKeyOfValidator<string> {

    get value() : string {
        return this._value;
    }
}