import { ArgError } from "./arg-error";

abstract class BaseObjectIdValidator<ValueType extends string | null | undefined> {
    protected _value: ValueType;
    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    default(def :string) {
        if (this.value === null || this.value === undefined) { return new ObjectIdRequiredNotnull(def, this._name); }
        else { return new ObjectIdRequiredNotnull(this.value, this._name); }
    }


    abstract get value(): ValueType;
}

export class ObjectIdOptionalNullable extends BaseObjectIdValidator<string | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); }
        else if (Array.isArray(value)) { throw new ArgError(name, 'array not allowed'); }
        else if (typeof value === 'object') { throw new ArgError(name, 'object note allowed'); }
        else if (!(/^[a-fA-F0-9]{24}$/.test(value.toString()))) { throw new ArgError(name, 'ObjectId required'); }
        else { super(value.toString(), name); }
    }


    get value() : string | null | undefined {
        return this._value;
    }

    get required() : ObjectIdRequiredNullable {
        if(this._value === undefined) { throw new ArgError(this._name, 'udefined not allowed'); }
        return new ObjectIdRequiredNullable(this._value, this._name);
    }

    get notnull() : ObjectIdOptionalNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectIdOptionalNotnull(this._value, this._name);
    }
}

export class ObjectIdRequiredNullable extends BaseObjectIdValidator<string | null> {

    constructor(value: string|null, name: string) {
        super(value, name);
    }

    get value() : string | null {
        return this._value;
    }

    get notnull() : ObjectIdRequiredNotnull {
        if(this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new ObjectIdRequiredNotnull(this._value, this._name);
    }
}

export class ObjectIdOptionalNotnull extends BaseObjectIdValidator<string | undefined> {

    constructor(value: string|undefined, name: string) {
        super(value, name);
    }

    get value() : string | undefined {
        return this._value;
    }

    get required() : ObjectIdRequiredNotnull {
        if(this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new ObjectIdRequiredNotnull(this._value, this._name);
    }
}


export class ObjectIdRequiredNotnull extends BaseObjectIdValidator<string> {

    constructor(value: string, name: string) {
        super(value, name);
    }

    get value() : string {
        return this._value;
    }
}