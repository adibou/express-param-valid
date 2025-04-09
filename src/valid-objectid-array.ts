import mongoose from 'mongoose';
import { ArgError } from './arg-error';

abstract class BaseObjectIdArrayValidator<Self, ValueType extends mongoose.Types.ObjectId[] | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    get defaultEmptyArray() {
        if (this._value === null || this._value === undefined) { return new ObjectIdArrayRequiredNotnull([], this._name); } 
        else { return new ObjectIdArrayRequiredNotnull(this._value, this._name); }
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

export class ObjectIdArrayOptionalNullable extends BaseObjectIdArrayValidator<ObjectIdArrayOptionalNullable, mongoose.Types.ObjectId[] | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (!Array.isArray(value)) { throw new ArgError('array-required') } 
        else { 
            const arr:mongoose.Types.ObjectId[] = [];
            value.filter(v => v !== null && v !== undefined).forEach(v => {
                if (Array.isArray(v)) { throw new ArgError('item-array-not-allowed', name) }
                if (typeof v === 'object') { throw new ArgError('item-object-not-allowed', name) }
                if (!mongoose.Types.ObjectId.isValid(v.toString())) { throw new ArgError('item-objectid-required', name) }
                arr.push(mongoose.Types.ObjectId.createFromHexString(v.toString()));
            });
            super(arr, name);
        }
    }


    get value() : mongoose.Types.ObjectId[] | null | undefined {
        return this._value;
    }

    get required() : ObjectIdArrayRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new ObjectIdArrayRequiredNullable(this._value, this._name);
    }

    get notnull() : ObjectIdArrayOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new ObjectIdArrayOptionalNotnull(this._value, this._name);
    }
}

export class ObjectIdArrayRequiredNullable extends BaseObjectIdArrayValidator<ObjectIdArrayRequiredNullable, mongoose.Types.ObjectId[] | null> {

    get value() : mongoose.Types.ObjectId[] | null {
        return this._value;
    }

    get notnull() : ObjectIdArrayRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new ObjectIdArrayRequiredNotnull(this._value, this._name);
    }
}

export class ObjectIdArrayOptionalNotnull extends BaseObjectIdArrayValidator<ObjectIdArrayOptionalNotnull, mongoose.Types.ObjectId[] | undefined> {

    get value() : mongoose.Types.ObjectId[] | undefined {
        return this._value;
    }

    get required() : ObjectIdArrayRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new ObjectIdArrayRequiredNotnull(this._value, this._name);
    }
}


export class ObjectIdArrayRequiredNotnull extends BaseObjectIdArrayValidator<ObjectIdArrayRequiredNotnull, mongoose.Types.ObjectId[]> {

    get value() : mongoose.Types.ObjectId[] {
        return this._value;
    }
}