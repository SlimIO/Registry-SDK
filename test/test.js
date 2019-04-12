// Require Node.js dependencies
const assert = require("assert");

// Require Third-Party dependencies
const { get, post } = require("httpie");

// Internal dependencies
const {
    meta,
    login,
    users,
    addon,
    addonName,
    publish,
    orga,
    orgaName,
    orgaAddUser
} = require("../index");

// Constantes
const PORT = 1337;
const REGISTRY_URL = new URL(`http://localhost:${PORT}`);

describe("Methods tests", () => {
    describe("#meta()", () => {
        it("should return a uptime as JSON", async() => {
            const data = await meta();
            assert.deepEqual(Object.keys(data), ["uptime"], "meta() method only return 'uptime' key");
        });
    });
});
