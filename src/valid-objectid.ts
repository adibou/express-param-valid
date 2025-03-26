import mongoose from 'mongoose';
import ArgError from './arg-error';

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
        else if (Array.isArray(value)) { throw new ArgError(name, 'array not allowed'); } 
        else if (typeof value === 'object') { throw new ArgError(name, 'object note allowed'); } 
        else if (!mongoose.Types.ObjectId.isValid(String(value))) { throw new ArgError(name, 'objectId invalide'); }
        else { super(mongoose.Types.ObjectId.createFromHexString(String(value)), name); }
    }


    get value() : mongoose.Types.ObjectId | null | undefined {
        return this._value;
    }

    get required() : ObjectIdRequiredNullable {
        if (this._value === undefined) { throw new ArgError(this._name, 'udefined not allowed'); }
        return new ObjectIdRequiredNullable(this._value, this._name);
    }

    get notnull() : ObjectIdOptionalNotnull {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectIdOptionalNotnull(this._value, this._name);
    }
}

export class ObjectIdRequiredNullable extends BaseObjectIdValidator<mongoose.Types.ObjectId | null> {

    get value() : mongoose.Types.ObjectId | null {
        return this._value;
    }

    get notnull() : ObjectIdRequiredNotnull {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectIdRequiredNotnull(this._value, this._name);
    }
}

export class ObjectIdOptionalNotnull extends BaseObjectIdValidator<mongoose.Types.ObjectId | undefined> {

    get value() : mongoose.Types.ObjectId | undefined {
        return this._value;
    }

    get required() : ObjectIdRequiredNotnull {
        if (this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new ObjectIdRequiredNotnull(this._value, this._name);
    }
}


export class ObjectIdRequiredNotnull extends BaseObjectIdValidator<mongoose.Types.ObjectId> {

    get value() : mongoose.Types.ObjectId {
        return this._value;
    }
}