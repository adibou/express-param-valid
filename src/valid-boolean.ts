import ArgError from './arg-error';

abstract class BaseBooleanValidator<ValueType extends boolean | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    default(def :boolean) {
        if (this.value === null || this.value === undefined) { new BooleanRequiredNotnull(def, this._name); } else { return new BooleanRequiredNotnull(this.value, this._name); }
    }

    abstract get value(): ValueType;
}

export class BooleanOptionalNullable extends BaseBooleanValidator<boolean | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (Array.isArray(value)) { throw new ArgError(name, 'array not allowed'); } 
        else if (typeof value === 'object') { throw new ArgError(name, 'object not allowed'); }
        else {
            if (value === true || value === 1 || value === 'true' || value === '1') { super(true, name); } 
            else if (value === false || value === 0 || value === 'false' || value === '0') { super(false, name); } else {
                throw new ArgError(name, 'boolean required');
            }
        }
    }

    get value() : boolean | null | undefined {
        return this._value;
    }

    get required() : BooleanRequiredNullable {
        if (this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new BooleanRequiredNullable(this._value, this._name);
    }

    get notnull() : BooleanOptionalNotnull {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new BooleanOptionalNotnull(this._value, this._name);
    }
}

export class BooleanRequiredNullable extends BaseBooleanValidator<boolean | null> {

    get value() : boolean | null {
        return this._value;
    }

    get notnull() : BooleanRequiredNotnull {
        if (this._value === null) { throw new ArgError(this._name, 'null not allowed'); }
        return new BooleanRequiredNotnull(this._value, this._name);
    }
}

export class BooleanOptionalNotnull extends BaseBooleanValidator<boolean | undefined> {

    get value() : boolean | undefined {
        return this._value;
    }

    get required() : BooleanRequiredNotnull {
        if (this._value === undefined) { throw new ArgError(this._name, 'undefined not allowed'); }
        return new BooleanRequiredNotnull(this._value, this._name);
    }
}


export class BooleanRequiredNotnull extends BaseBooleanValidator<boolean> {

    get value() : boolean {
        return this._value;
    }
}