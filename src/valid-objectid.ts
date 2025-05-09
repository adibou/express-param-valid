import mongoose from 'mongoose';
import { ArgError } from './arg-error';

abstract class BaseObjectIdValidator<ValueType extends mongoose.Types.ObjectId | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    abstract get value(): ValueType;
}

export class ObjectIdOptionalNullable extends BaseObjectIdValidator<mongoose.Types.ObjectId | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (Array.isArray(value)) { throw new ArgError('array-not-allowed', name); }
        else if (typeof value === 'object') { throw new ArgError('object-not-allowed', name); }
        else if (!mongoose.Types.ObjectId.isValid(String(value))) { throw new ArgError('objectid-required', name); }
        else { super(mongoose.Types.ObjectId.createFromHexString(String(value)), name); }
    }


    get value() : mongoose.Types.ObjectId | null | undefined {
        return this._value;
    }

    get required() : ObjectIdRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new ObjectIdRequiredNullable(this._value, this._name);
    }

    get notnull() : ObjectIdOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new ObjectIdOptionalNotnull(this._value, this._name);
    }
}

export class ObjectIdRequiredNullable extends BaseObjectIdValidator<mongoose.Types.ObjectId | null> {

    get value() : mongoose.Types.ObjectId | null {
        return this._value;
    }

    get notnull() : ObjectIdRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new ObjectIdRequiredNotnull(this._value, this._name);
    }
}

export class ObjectIdOptionalNotnull extends BaseObjectIdValidator<mongoose.Types.ObjectId | undefined> {

    get value() : mongoose.Types.ObjectId | undefined {
        return this._value;
    }

    get required() : ObjectIdRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new ObjectIdRequiredNotnull(this._value, this._name);
    }
}


export class ObjectIdRequiredNotnull extends BaseObjectIdValidator<mongoose.Types.ObjectId> {

    get value() : mongoose.Types.ObjectId {
        return this._value;
    }
}