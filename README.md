# Registry-SDK
![version](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

Registry-SDK is a set methods to query the Registry API. A account will required for use this package. See [Registry](https://github.com/SlimIO/Registry).

## Requirements
- Node.js v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/registry-sdk
# or
$ yarn add @slimio/registry-sdk
```

## Usage example
```js
require("dotenv").config();
const { login } = require("@slimio/registry-sdk");

async function main() {
    // Note: Never store your credentials in clear in the code (use a local .env file).
    const accessToken = await login(process.env.LOGIN, process.env.PASSWORD);
    console.log(accessToken);
}
main().catch(console.error);
```

## API
This section describe the SDK methods. For a complete type definition, take a look at `index.d.ts` !
For more information see the documentation of the [Registry](https://github.com/SlimIO/Registry).

> ⚠️ In the following examples, we often use top-level await


<details><summary>meta(): Promise< MetaData ></summary>
<br />

Return the registry metadata. For the moment only the **uptime** property is available.

```js
const { meta } = require("@slimio/registry-sdk");

const { uptime } = await meta();
console.log(uptime);
```
</details>

### Users methods

<details><summary>login(username: string, password: string): Promise< string ></summary>
<br />

Authenticate a user and get an AccessToken string. This token will be required as argument by some of the other SDK methods.

```js
require("dotenv").config();
const { login } = require("@slimio/registry-sdk");

async function main() {
    // Note: Never store your credentials in clear in the code (use a local .env file).
    const accessToken = await login(process.env.LOGIN, process.env.PASSWORD);
    console.log("Your access token: ", accessToken);
}
main().catch(console.error);
```
</details>

<details><summary>users(username: string, password: string): Promise< userId ></summary>
<br />

Create a new user with a new ID.
```js
const { users } = require("@slimio/registry-sdk");

const { userId } = users("newUsername", "newPassword");

// Return a new ID
console.log(userId);
```
</details>

### Addons methods

<details><summary>addon(): Promise< string[] ></summary>
<br />

Get all available addons on the requested registry. This method return an Array of string containing addons names.
```js
const { addon } = require("@slimio/registry-sdk");

const addons = await addon();
console.log(addons);
```
</details>

<details><summary>publish(addonMainDir: string, token: string): Promise< addonId ></summary>
<br />

Create or update an Addon release. This endpoint require an AccessToken.

>⚠️ publish() to need that your main directory must contain package.json and slimio.toml files !

```js
// Example :

const { login, publish } = require("@slimio/registry-sdk");

const myToken = await login("admin", "admin147");
const { addonId } = await publish(__dirname, myToken);

// Return the Id of the new addon
console.log(addonId);
```
</details>

<details><summary>addonName(name: string): Promise< addonInfos ></summary>
<br />

Get a given addon by his name.
```js
const { addonName } = require("@slimio/registry-sdk");

// Example
const { description, updateAt } = await addonName("memory");

console.log(description, updateAt);
```

This method return an object with all addon's informations. See [Registry](https://github.com/SlimIO/Registry) for more details.
</details>

<details><summary>orga(): Promise< listOrgas ></summary>
<br />

Get all organisations.

```js
const { orga } = require("@slimio/registry-sdk");

// Example
const organisations = await orga();
const organisationsName = Object.keys(organisations);

// List organisations
console.log(organisationsName);
```

This method returns an object where each key represents an organization.
</details>

<details><summary>orgaName(name: string): Promise< orgaInfos ></summary>
<br />

Get an organisation by his name.

```js
const { orgaName } = require("@slimio/registry-sdk");

// Example
const { users } = await orgaName("SlimIO");

    console.log("This organisation contains the following users :");
    for (const user of users) {
        console.log(`- ${user.username}`);
    }
}
```

This method return an object with all organisation's informations. See [Registry](https://github.com/SlimIO/Registry) for more details.
</details>

<details><summary>orgaAddUser(organame: string, username: string, token: string): Promise< orgaUserinfos ></summary>
<br />

Add a user to an organisation. This endpoint require an AccessToken.

```js
const { users, login, orgaAddUser } = require("@slimio/registry-sdk");

// Example
// If the user to add desn't exist in the database, create this.
await users("newUsername", "newPassword");

const myToken = await login("myUsername", "myPassword");
const { createdAt, userId } = await orgaAddUser("orgaName", "newUsername", myToken);

console.log(createdAt, userId);
```
>⚠️ Only Organisation owner can use this method.

This method return an object with the registration informations.

</details>

## Dependencies

|Name|Refactoring|Security Risk|Usage|
|---|---|---|---|
|[@slimio/manifest](https://github.com/SlimIO/Manifester#readme)|Minor|Low|SlimIO Manifest|
|[httpie](https://github.com/lukeed/httpie#readme)|Minor|Low|HTTP Request|
|[ow](https://github.com/sindresorhus/ow#readme)|Minor|Low|OW|

## License
MIT
