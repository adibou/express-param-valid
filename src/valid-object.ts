import ArgError from './arg-error';

abstract class BaseObjectValidator<T, ValueType extends T | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }    

    abstract get value(): ValueType;
}

export class ObjectOptionalNullable<T> extends BaseObjectValidator<T, T | null | undefined> {

    constructor(value: unknown, name: string, validator: (value:any) => T) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (Array.isArray(value)) { throw new ArgError(name, 'array not accepted'); }
        else { 
            try {
                const obj : T = validator(value);
                super(obj, name);
            }
            catch (e) {
                if (e instanceof ArgError) { throw new ArgError(name, e.message); }
                else { throw e; }
            }
        }
    }


    get value() : T | null | undefined {
        return this._value;
    }

    get required() : ObjectRequiredNullable<T> {
        if (this._value === undefined) { throw new ArgError(this._name, 'udefined not allowed'); }
        return new ObjectRequiredNullable(this._value, this._name);
    }

    get notnull() : ObjectOptionalNotnull<T> {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectOptionalNotnull(this._value, this._name);
    }
}

export class ObjectRequiredNullable<T> extends BaseObjectValidator<T, T | null> {

    get value() : T | null {
        return this._value;
    }

    get notnull() : ObjectRequiredNotnull<T> {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectRequiredNotnull(this._value, this._name);
    }
}

export class ObjectOptionalNotnull<T> extends BaseObjectValidator<T, T | undefined> {

    get value() : T | undefined {
        return this._value;
    }

    get required() : ObjectRequiredNotnull<T> {
        if (this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new ObjectRequiredNotnull(this._value, this._name);
    }
}


export class ObjectRequiredNotnull<T> extends BaseObjectValidator<T, T> {
    get value() : T {
        return this._value;
    }
}