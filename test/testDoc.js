const { meta, login, users, addon, addonName, publish, orga, orgaAddUser, orgaName } = require("../index.js");


async function main() {
    const token = await login("admin", "admin1953");

    console.log(token);
}

main();
