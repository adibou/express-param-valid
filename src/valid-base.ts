import { BooleanOptionalNullable } from './valid-boolean';
import { NumberOptionalNullable } from './valid-number';
import { StringOptionalNullable } from './valid-string';
import { StringArrayOptionalNullable } from './valid-string-array';
import { NumberArrayOptionalNullable } from './valid-number-array';
import { ObjectIdOptionalNullable } from './valid-objectid';
import { PasswordOptionalNullable } from './valid-password';
import { ObjectIdArrayOptionalNullable } from './valid-objectid-array';
import { KeyOfOptionalNullable } from './keyof';
import { EnumOptionalNullable } from './valid-enum';
import { ObjectArrayOptionalNullable } from './valid-object-array';
import { ObjectOptionalNullable } from './valid-object';
import { DateOptionalNullable } from './valid-date';

export default class ValidBase {
    value: unknown;

    name: string;

    paramType: 'body' | 'params';
    

    constructor(value:unknown, name:string, paramType:'body' | 'params') {
        this.value = value;
        this.name = name;
        this.paramType = paramType;
    }

    get string() { return new StringOptionalNullable(this.value, this.name); }

    get number() { return new NumberOptionalNullable(this.value, this.name); }

    get boolean() { return new BooleanOptionalNullable(this.value, this.name); }

    get stringArray() { return new StringArrayOptionalNullable(this.value, this.name); }

    get numberArray() { return new NumberArrayOptionalNullable(this.value, this.name); }

    get objectId() { return new ObjectIdOptionalNullable(this.value, this.name); }

    get objectIdArray() { return new ObjectIdArrayOptionalNullable(this.value, this.name); }

    get password() { return new PasswordOptionalNullable(this.value, this.name); }

    get date() { return new DateOptionalNullable(this.value, this.name); }

    keyof(obj : Record<string, any>) { return new KeyOfOptionalNullable(this.value, this.name, obj); }

    enum<T>(values:ReadonlyArray<string>) { return new EnumOptionalNullable<T>(this.value, this.name, values); }

    objectArray<T>(validator:(value:any) => T) { return new ObjectArrayOptionalNullable<T>(this.value, this.name, validator); }

    object<T>(validator:(value:any) => T) { return new ObjectOptionalNullable<T>(this.value, this.name, validator); }

}