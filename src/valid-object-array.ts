import ArgError from './arg-error';

abstract class BaseObjectArrayValidator<T, ValueType extends T[] | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    get defaultEmptyArray() {
        if (this._value === null || this._value === undefined) { return new ObjectArrayRequiredNotnull<T>([], this._name); } 
        else { return new ObjectArrayRequiredNotnull<T>(this._value, this._name); }
    }
    

    abstract get value(): ValueType;
}

export class ObjectArrayOptionalNullable<T> extends BaseObjectArrayValidator<T, T[] | null | undefined> {

    constructor(value: unknown, name: string, validator: (value:any) => T) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (!Array.isArray(value)) { throw new ArgError(name, 'array required'); } 
        else { 
            const arr:T[] = [];
            value.forEach(v => {
                arr.push(validator(v));
            });
            super(arr, name);
        }
    }


    get value() : T[] | null | undefined {
        return this._value;
    }

    get required() : ObjectArrayRequiredNullable<T> {
        if (this._value === undefined) { throw new ArgError(this._name, 'udefined not allowed'); }
        return new ObjectArrayRequiredNullable(this._value, this._name);
    }

    get notnull() : ObjectArrayOptionalNotnull<T> {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectArrayOptionalNotnull(this._value, this._name);
    }
}

export class ObjectArrayRequiredNullable<T> extends BaseObjectArrayValidator<T, T[] | null> {

    get value() : T[] | null {
        return this._value;
    }

    get notnull() : ObjectArrayRequiredNotnull<T> {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectArrayRequiredNotnull(this._value, this._name);
    }
}

export class ObjectArrayOptionalNotnull<T> extends BaseObjectArrayValidator<T, T[] | undefined> {

    get value() : T[] | undefined {
        return this._value;
    }

    get required() : ObjectArrayRequiredNotnull<T> {
        if (this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new ObjectArrayRequiredNotnull(this._value, this._name);
    }
}


export class ObjectArrayRequiredNotnull<T> extends BaseObjectArrayValidator<T, T[]> {
    get value() : T[] {
        return this._value;
    }
}