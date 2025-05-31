import mongoose from 'mongoose';
import { ArgError } from './arg-error';

abstract class BaseObjectIdArrayValidator<T, ValueType extends T[] | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    abstract get value(): ValueType;
}

export class EnumArrayOptionalNullable<T> extends BaseObjectIdArrayValidator<T, T[] | null | undefined> {

    constructor(value: unknown, name: string, values: ReadonlyArray<string>) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (!Array.isArray(value)) { throw new ArgError('array-required') } 
        else { 
            const arr:T[] = [];
            value.filter(v => v !== null && v !== undefined).forEach(v => {
                if (Array.isArray(v)) { throw new ArgError('item-array-not-allowed', name) }
                else if (typeof v === 'object') { throw new ArgError('item-object-not-allowed', name) }
                else if (values.indexOf(value.toString()) === -1) { throw new ArgError('invalid-key', name); }
                arr.push(v as T);
            });
            super(arr, name);
        }
    }


    get value() : T[] | null | undefined {
        return this._value;
    }

    get required() : EnumArrayRequiredNullable<T> {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new EnumArrayRequiredNullable(this._value, this._name);
    }

    get notnull() : EnumArrayOptionalNotnull<T> {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new EnumArrayOptionalNotnull(this._value, this._name);
    }
}

export class EnumArrayRequiredNullable<T> extends BaseObjectIdArrayValidator<T, T[] | null> {

    get value() : T[] | null {
        return this._value;
    }

    get notnull() : EnumArrayRequiredNotnull<T> {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new EnumArrayRequiredNotnull(this._value, this._name);
    }
}

export class EnumArrayOptionalNotnull<T> extends BaseObjectIdArrayValidator<T, T[] | undefined> {

    get value() : T[] | undefined {
        return this._value;
    }

    get required() : EnumArrayRequiredNotnull<T> {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new EnumArrayRequiredNotnull(this._value, this._name);
    }
}


export class EnumArrayRequiredNotnull<T> extends BaseObjectIdArrayValidator<T, T[]> {

    get value() : T[] {
        return this._value;
    }
}