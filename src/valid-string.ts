import { ArgError } from './arg-error';
import luhnChecker from './checkers/luhn-checker';
import ibanChecker from './checkers/iban-cheker';
import nirChecker from './checkers/nir-checker';

abstract class BaseStringValidator<Self, ValueType extends string | null | undefined> {
    protected _value: ValueType;

    protected _name: string;

    constructor(value: ValueType, name: string) {
        this._name = name;
        this._value = value;
    }

    length(min:number | undefined, max:number | undefined) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (min !== undefined && this._value.length < min) { throw new ArgError('string-min-length', this._name, min.toString()); }
        if (max !== undefined && this._value.length > max) { throw new ArgError('string-max-length', this._name, max.toString()); }
        return this as unknown as Self;
    }

    max(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length > length) { throw new ArgError('string-max-length', this._name, length.toString()); }
        return this as unknown as Self;
    }

    min(length:number) : Self {
        if (this._value === null || this._value === undefined) { return this as unknown as Self; }
        if (this._value.length < length) { throw new ArgError('string-min-length', this._name, length.toString()); }
        return this as unknown as Self;
    }

    get trim() { 
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        this._value = this.value.trim() as unknown as ValueType;
        return this as unknown as Self;
    }

    get notEmpty() {
        if (this.value === null || this.value === undefined) { return this as unknown as Self; }
        if (this.value === '') { throw new ArgError('string-min-length', this._name, '1'); }
        return this as unknown as Self;
    }

    get email() {
        if (this.value === null || this.value === undefined || this.value === '')  { return this; }
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(this.value)) {  throw new ArgError('email-required', this._name); }
        return this;
    }

    get rpps() {
        if (this.value == null || this.value === '' || this.value === undefined) { return this; }
        const num = this.value.replace(/\s+/g, '');
        // 11 chiffres + Luhn
        if (!/^\d{11}$/.test(num) || !luhnChecker(num)) {
            throw new ArgError('rpps-required', this._name);
        }
        return this;
    }

    get iban() {
        if (this.value == null || this.value === '' || this.value === undefined) { return this; }
        const iban = this.value.replace(/\s+/g, '').toUpperCase();
        // 2 lettres + 2 chiffres + 4 lettres + 10 chiffres
        if (!/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(iban) || !ibanChecker(iban)) {
            throw new ArgError('iban-required', this._name);
        }
        return this;
    }

    get nir() {
        if (this.value == null || this.value === '' || this.value === undefined) { return this; }
        const raw = this.value.replace(/\s+/g, '').toUpperCase();
        const nirRe = /^[12]\d{2}(0[1-9]|1[0-2]|[2-9]\d)(0[1-9]|[1-8]\d|9[0-8]|2A|2B|99)\d{3}\d{3}\d{2}$/;
        if (!nirRe.test(raw) || !nirChecker(raw)) {
            throw new ArgError('nir-required', this._name);
        }
        return this;
    }

    get phoneFR() {
        if (this.value == null || this.value === '' || this.value === undefined) { return this; }
        const digits = this.value.replace(/[\s.-]/g, '');
        const frRe = /^(?:0[1-9]\d{8}|(?:\+33|0033)[1-9]\d{8})$/;

        if (!frRe.test(digits)) {
            throw new ArgError('phoneFR-required', this._name);
        }
        return this;
    }


    get hasContent() : StringRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new StringRequiredNotnull(this._value, this._name).trim.email;
    }

    pattern( pattern:RegExp) {
        if (this.value === null || this.value === undefined || this.value === '') { return this; }
        if (!pattern.test(this.value)) { throw new ArgError('pattern-not-matching', this._name); }
        return this;
    }

    default(def :string) {
        if (this.value === null || this.value === undefined) { return new StringRequiredNotnull(def, this._name); } 
        else { return new StringRequiredNotnull(this.value, this._name); }
    }


    abstract get value(): ValueType;
}

export class StringOptionalNullable extends BaseStringValidator<StringOptionalNullable, string | null | undefined> {

    constructor(value: unknown, name: string) {
        if (value === undefined || value === null) { super(value, name); } 
        else if (Array.isArray(value)) { throw new ArgError('array-not-allowed', name); }
        else if (typeof value === 'object') { throw new ArgError('object-not-allowed', name); }
        else { super(value.toString(), name); }
    }

    get value() : string | null | undefined {
        return this._value;
    }

    get required() : StringRequiredNullable {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new StringRequiredNullable(this._value, this._name);
    }

    get notnull() : StringOptionalNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new StringOptionalNotnull(this._value, this._name);
    }
}

export class StringRequiredNullable extends BaseStringValidator<StringRequiredNullable, string | null> {

    get value() : string | null {
        return this._value;
    }

    get notnull() : StringRequiredNotnull {
        if (this._value === null) { throw new ArgError('null-not-allowed', this._name); }
        return new StringRequiredNotnull(this._value, this._name);
    }
}

export class StringOptionalNotnull extends BaseStringValidator<StringOptionalNotnull, string | undefined> {

    get value() : string | undefined {
        return this._value;
    }

    get required() : StringRequiredNotnull {
        if (this._value === undefined) { throw new ArgError('undefined-not-allowed', this._name); }
        return new StringRequiredNotnull(this._value, this._name);
    }
}


export class StringRequiredNotnull extends BaseStringValidator<StringRequiredNotnull, string> {
    get value() : string {
        return this._value;
    }
}