const setOfMethods = require("./index");
const { meta, login, users, addon, addonName, publish, orga, orgaName, orgaAddUser } = setOfMethods;

async function test() {
    const { uptime } = await meta();

    // Return a number
    console.log(uptime);
}

test();
