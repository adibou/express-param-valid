import mongoose from 'mongoose';
import ArgError from './arg-error';

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
        if (this._value.length > length) { throw new ArgError(this._name, `maximum array length exceeded ${this._value.length} received instead of ${length}`); }
        return this as unknown as Self;
    }

    minArrayLength(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length < length) { throw new ArgError(this._name, `minimum array length not reached ${this._value.length} received instead of ${length}`); }
        return this as unknown as Self;
    }

    get notEmptyArray() : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length === 0) { throw new ArgError(this._name, 'empty array not autorized'); }
        return this as unknown as Self;
    }

    abstract get value(): ValueType;
}

export class ObjectIdArrayOptionalNullable extends BaseObjectIdArrayValidator<ObjectIdArrayOptionalNullable, mongoose.Types.ObjectId[] | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (!Array.isArray(value)) { throw new ArgError(name, 'array required'); } 
        else { 
            const arr:mongoose.Types.ObjectId[] = [];
            value.filter(v => v !== null && v !== undefined).forEach(v => {
                if (Array.isArray(v)) { throw new ArgError(name, 'array not allowed inside this array'); }
                if (typeof v === 'object') { throw new ArgError(name, 'object not allowed inside this array'); }
                if (!mongoose.Types.ObjectId.isValid(v.toString())) { throw new ArgError(name, 'one element is not a valid objectId'); }
                arr.push(mongoose.Types.ObjectId.createFromHexString(v.toString()));
            });
            super(arr, name);
        }
    }


    get value() : mongoose.Types.ObjectId[] | null | undefined {
        return this._value;
    }

    get required() : ObjectIdArrayRequiredNullable {
        if (this._value === undefined) { throw new ArgError(this._name, 'udefined not allowed'); }
        return new ObjectIdArrayRequiredNullable(this._value, this._name);
    }

    get notnull() : ObjectIdArrayOptionalNotnull {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectIdArrayOptionalNotnull(this._value, this._name);
    }
}

export class ObjectIdArrayRequiredNullable extends BaseObjectIdArrayValidator<ObjectIdArrayRequiredNullable, mongoose.Types.ObjectId[] | null> {

    get value() : mongoose.Types.ObjectId[] | null {
        return this._value;
    }

    get notnull() : ObjectIdArrayRequiredNotnull {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectIdArrayRequiredNotnull(this._value, this._name);
    }
}

export class ObjectIdArrayOptionalNotnull extends BaseObjectIdArrayValidator<ObjectIdArrayOptionalNotnull, mongoose.Types.ObjectId[] | undefined> {

    get value() : mongoose.Types.ObjectId[] | undefined {
        return this._value;
    }

    get required() : ObjectIdArrayRequiredNotnull {
        if (this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new ObjectIdArrayRequiredNotnull(this._value, this._name);
    }
}


export class ObjectIdArrayRequiredNotnull extends BaseObjectIdArrayValidator<ObjectIdArrayRequiredNotnull, mongoose.Types.ObjectId[]> {

    get value() : mongoose.Types.ObjectId[] {
        return this._value;
    }
}