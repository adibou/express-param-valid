import e = require('express');
import FullArgError, { ArgError } from './arg-error';

abstract class BaseMetasValidator<Self, ValueType extends Record<string, string|null> | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }    

    default(def :Record<string, string|null>) {
            if (this.value === null || this.value === undefined) { return new MetasRequiredNotnull(def, this._name); } 
            else { return new MetasRequiredNotnull(this.value, this._name); }
    }
    
    abstract get value(): ValueType;
}

export class MetasOptionalNullable<T> extends BaseMetasValidator<T, Record<string, string|null> | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (typeof value !== 'object') { throw new ArgError('object-required', name); }
        else if (Array.isArray(value)) { throw new ArgError('array-not-allowed', name); }
        else { 
            try {
                const result  = value as Record<string, string|null>;
                const data= value as Record<string, unknown>;
                Object.keys(data).forEach(k => {
                    if(data[k] !== undefined) {
                        if(data[k] === null || typeof data[k] === 'string') {
                            result[k] = data[k]
                        }
                        else if(typeof data[k] === 'number' || typeof data[k] === 'boolean') {
                            result[k] = data[k].toString();
                        }
                        else {
                            result[k] = JSON.stringify(data[k]);
                        }
                    }
                });
                super(result, name);
            }
            catch (e) {
                if (e instanceof FullArgError) { throw new FullArgError(e.code, e.field, e.message, e.errorDetails); }
                else { throw e; }
            }
        }
    }


    get value() : Record<string, string|null> | null | undefined {
        return this._value;
    }

    get required() : MetasRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new MetasRequiredNullable(this._value, this._name);
    }

    get notnull() : MetasOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new MetasOptionalNotnull(this._value, this._name);
    }
}

export class MetasRequiredNullable extends BaseMetasValidator<MetasRequiredNullable, Record<string, string|null> | null> {

    get value() : Record<string, string|null> | null {
        return this._value;
    }

    get notnull() : MetasRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new MetasRequiredNotnull(this._value, this._name);
    }
}

export class MetasOptionalNotnull extends BaseMetasValidator<MetasOptionalNotnull, Record<string, string|null> | undefined> {

    get value() : Record<string, string|null> | undefined {
        return this._value;
    }

    get required() : MetasRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new MetasRequiredNotnull(this._value, this._name);
    }
}


export class MetasRequiredNotnull extends BaseMetasValidator<MetasRequiredNotnull, Record<string, string|null>> {
    get value() : Record<string, string|null> {
        return this._value;
    }
}