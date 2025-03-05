import { BooleanOptionalNullable } from "valid-boolean";
import { NumberOptionalNullable } from "./valid-number";
import { StringOptionalNullable } from "./valid-string";
import { StringArrayOptionalNullable } from "valid-string-array";
import { NumberArrayOptionalNullable } from "valid-number-array";
import { ObjectIdOptionalNullable } from "valid-objectid";

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
}