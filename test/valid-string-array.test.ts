import { describe, it } from "node:test";
import assert from "assert";
import { StringArrayOptionalNullable } from "../src/valid-string-array";


describe('valid-string-array', {concurrency:true}, () => {

    it('should fail if not array', async () => {
        assert.throws(() => new StringArrayOptionalNullable('string', 'name'), {name: 'ArgError'});
        assert.throws(() => new StringArrayOptionalNullable(true, 'name'), {name: 'ArgError'});
        assert.throws(() => new StringArrayOptionalNullable(123, 'name'), {name: 'ArgError'});
        assert.throws(() => new StringArrayOptionalNullable({}, 'name'), {name: 'ArgError'});
    });

    it('should pass on empty array', async () => {
        assert.doesNotThrow(() => new StringArrayOptionalNullable([], 'name'));
    });

    it('should fail on notEmptyArray', async () => {
        assert.throws(() => new StringArrayOptionalNullable([], 'name').notEmptyArray, {name: 'ArgError'});
    });


    it('should pass on null', async () => {
        assert.doesNotThrow(() => new StringArrayOptionalNullable(null, 'name'));
    });

    it('should fail on notnull', async () => {
        assert.throws(() => new StringArrayOptionalNullable(null, 'name').notnull, {name: 'ArgError'});
    });

    it('should pass on undefined', async () => {
        assert.doesNotThrow(() => new StringArrayOptionalNullable(undefined, 'name'));
    });

    it('should fail on required', async () => {
        assert.throws(() => new StringArrayOptionalNullable(undefined, 'name').required, {name: 'ArgError'});
    });

    it('should pass on minArrayLength', async () => {
        assert.doesNotThrow(() => new StringArrayOptionalNullable(['string', 'string'], 'name').minArrayLength(1));
    });

    it('should fail on minArrayLength', async () => {
        assert.throws(() => new StringArrayOptionalNullable(['string'], 'name').minArrayLength(2), {name: 'ArgError'});
    });

    it('should pass on maxArrayLength', async () => {
        assert.doesNotThrow(() => new StringArrayOptionalNullable(['string'], 'name').maxArrayLength(1));
    });

    it('should fail on maxArrayLength', async () => {
        assert.throws(() => new StringArrayOptionalNullable(['string', 'string'], 'name').maxArrayLength(1), {name: 'ArgError'});
    });

    it('should trim array', async () => {
        assert.deepStrictEqual(new StringArrayOptionalNullable(['string', '', undefined, null], 'name').trimArray.required.notnull.value, ['string']);
    });

    it('should fail if one element is too long', async () => {
        assert.throws(() => new StringArrayOptionalNullable(['string', 'str'], 'name').max(4), {name: 'ArgError'});
    });

    it('should pass if all elements are short enough', async () => {
        assert.doesNotThrow(() => new StringArrayOptionalNullable(['string', 'str'], 'name').max(10));
    });

    it('should fail if one element is too short', async () => {
        assert.throws(() => new StringArrayOptionalNullable(['string', 'str'], 'name').min(5), {name: 'ArgError'});
    });

    it('should pass if all elements are valid email', async () => {
        assert.doesNotThrow(() => new StringArrayOptionalNullable(['test@mail.com', 'ta@mail.com'], 'name').email);
    });

    it('should fail if one element is not a valid email', async () => {
        assert.throws(() => new StringArrayOptionalNullable(['teast@mail.com', 'tttmail.com'], 'name').email, {name: 'ArgError'});
    });

    it('should pass if all elements match pattern', async () => {
        assert.doesNotThrow(() => new StringArrayOptionalNullable(['test', 'test2'], 'name').pattern(/test/));
    });

    it('should fail if one element does not match pattern', async () => {
        assert.throws(() => new StringArrayOptionalNullable(['test', 'test2'], 'name').pattern(/test2/), {name: 'ArgError'});
    });

    it('should trim each element', async () => {
        assert.deepStrictEqual(new StringArrayOptionalNullable([' test ', ' test2 '], 'name').trim.required.notnull.value, ['test', 'test2']);
    });

});