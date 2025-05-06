import { ArgError } from './arg-error';

abstract class BaseDateValidator<Self, ValueType extends Date | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    get past() : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        const d = new Date(this._value);
        if (d.getTime() > Date.now()) { throw new ArgError('date-past', this._name, d.toISOString()); }
        return this as unknown as Self;
    }

    get futur() : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        const d = new Date(this._value);
        if (d.getTime() < Date.now()) { throw new ArgError('date-future', this._name, d.toISOString()); }
        return this as unknown as Self;
    }

    default(def :Date) : DateRequiredNotnull {
        if (this.value === null || this.value === undefined) { return new DateRequiredNotnull(def, this._name); } 
        else { return new DateRequiredNotnull(this.value, this._name); }
    }

    get defaultNow() : DateRequiredNotnull {
        if (this.value === null || this.value === undefined) { return new DateRequiredNotnull(new Date(), this._name); } 
        else { return new DateRequiredNotnull(this.value, this._name); }
    }   

    abstract get value(): ValueType;
}

export class DateOptionalNullable extends BaseDateValidator<DateOptionalNullable, Date | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (Array.isArray(value)) { throw new ArgError('array-not-allowed', name); }
        else if (typeof value === 'object') { throw new ArgError('object-not-allowed', name); }
        else {
            const isIsoUtc = typeof value === 'string' && !isNaN(Date.parse(value)) && new Date(value).toISOString() === value
            if (!isIsoUtc) { throw new ArgError('date-utc-required', name); }
            else { super(new Date(value), name); }
        }
    }

    get value() : Date | null | undefined {
        return this._value;
    }

    get required() : DateRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new DateRequiredNullable(this._value, this._name);
    }

    get notnull() : DateOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new DateOptionalNotnull(this._value, this._name);
    }
}

export class DateRequiredNullable extends BaseDateValidator<DateRequiredNullable, Date | null> {

    get value() : Date | null {
        return this._value;
    }

    get notnull() : DateRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new DateRequiredNotnull(this._value, this._name);
    }
}

export class DateOptionalNotnull extends BaseDateValidator<DateOptionalNotnull, Date | undefined> {

    get value() : Date | undefined {
        return this._value;
    }

    get required() : DateRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new DateRequiredNotnull(this._value, this._name);
    }
}


export class DateRequiredNotnull extends BaseDateValidator<DateRequiredNotnull, Date> {

    get value() : Date {
        return this._value;
    }
}




