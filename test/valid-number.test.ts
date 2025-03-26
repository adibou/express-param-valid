import { describe, it } from "node:test";
import assert from "assert";
describe('valid-number', {concurrency:true}, () => {

    it('should accept undefined', async () => {
        assert.doesNotThrow(() => {body: undefined}, 'undefined should be accepted');
    });
});