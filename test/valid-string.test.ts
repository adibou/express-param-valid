import { describe, it } from "node:test";
import assert from "assert";
import { StringOptionalNullable } from "../src/valid-string";


describe('valid-string', {concurrency:true}, () => {
    it('should fail on array', async () => {
        assert.throws(() => new StringOptionalNullable([], 'name'), {name: 'ArgError'});
    });

    it('should fail on object', async () => {
        assert.throws(() => new StringOptionalNullable({}, 'name'), {name: 'ArgError'});
    });

    it('should pass on null', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable(null, 'name'));
    });

    it('should throw on notnull', async () => {
        assert.throws(() => new StringOptionalNullable(null, 'name').notnull, {name: 'ArgError'});
    });

    it('should pass on undefined', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable(undefined, 'name'));
    });

    it('should throw on required', async () => {
        assert.throws(() => new StringOptionalNullable(undefined, 'name').required, {name: 'ArgError'});
    });

    it('should pass on string', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable('string', 'name'));
    });

    it('should pass on number', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable(123, 'name'));
    });

    it('should convert number to string', async () => {
        assert.strictEqual(new StringOptionalNullable(123, 'name').required.notnull.value, '123');
    });

    it('should pass on boolean', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable(true, 'name'));
    });

    it('should convert boolean to string', async () => {
        assert.strictEqual(new StringOptionalNullable(true, 'name').required.notnull.value, 'true');
    });

    it('should throw on toolong', async () => {
        assert.throws(() => new StringOptionalNullable('abcd', 'name').maxLength(2), {name: 'ArgError'});
    });

    it('should pass if not too toolong', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable('abcd', 'name').maxLength(4));
    });

    it('should throw on tooshort', async () => {
        assert.throws(() => new StringOptionalNullable('abcd', 'name').minLength(5), {name: 'ArgError'});
    });

    it('should pass if in length', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable('abcd', 'name').length(3, 5));
    });

    it('should throw if not in length', async () => {
        assert.throws(() => new StringOptionalNullable('abcd', 'name').length(5, 10), {name: 'ArgError'});
        assert.throws(() => new StringOptionalNullable('abcd', 'name').length(1, 2), {name: 'ArgError'});
    });

    it('should pass if not too tooshort', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable('abcd', 'name').minLength(3));
    });

    it('should trim', async () => {
        assert.equal(new StringOptionalNullable(' abcd ', 'name').trim.value, 'abcd');
    });

    it('should throw on empty', async () => {
        assert.throws(() => new StringOptionalNullable('', 'name').notEmpty, {name: 'ArgError'});
    });

    it('should pass if empty allowed', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable('', 'name'));
    });

    it('should pass on email', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable('test@email.com', 'name').email);
    });

    it('should throw on invalid email', async () => {
        assert.throws(() => new StringOptionalNullable('testemail.com', 'name').email, {name: 'ArgError'});
    });

    it('should pass on pattern', async () => {
        assert.doesNotThrow(() => new StringOptionalNullable('test', 'name').pattern(/test/));
    });

    it('should throw on invalid pattern', async () => {
        assert.throws(() => new StringOptionalNullable('test', 'name').pattern(/test2/), {name: 'ArgError'});
    });

    it('should return default value', async () => {
        assert.equal(new StringOptionalNullable(undefined, 'name').default('default').value, 'default');
        assert.equal(new StringOptionalNullable(null, 'name').default('default').value, 'default');
    });
});