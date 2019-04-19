const setOfMethods = require("./index");
const { meta, login, users, addon, addonName, publish, orga, orgaName, orgaAddUser } = setOfMethods;

async function test() {
    const myToken = await login("admin1", "admin1953");
    const { addonId } = await publish("/test", myToken);

    console.log(addonId);
}

test();
