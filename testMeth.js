const setOfMethods = require("./index");
const { join } = require("path");
const { meta, login, users, addon, addonName, publish, orga, orgaName, orgaAddUser } = setOfMethods;

async function test() {
    await users("test1235", "test1235");

    const myToken = await login("admin1", "admin1953");
    const interfaceRet = await orgaAddUser("Organisation", "test1235", myToken);

    console.log(interfaceRet);
}

test();
