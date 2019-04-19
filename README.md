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
const { login } = require("@slimio/registry-sdk");

const token = login("myUsername", "myPassword");

// Return an Acces Token
console.log(token);
```

## API
This section describe how works the methods of Registry-SDK. For a complete definition, take a look at `index.d.ts` !  
For more information on methods's return, see the documentation of the [Registry](https://github.com/SlimIO/Registry).


<details><summary>meta(): Promise < MetaData ></summary>

<br />

Return service metadata.

```js
const { meta } = require("@slimio/registry-sdk");

const { uptime } = await meta();

// Return a number
console.log(uptime);
```

<br />

</details>

<details><summary>login(username: string, password: string): Promise < AccessToken ></summary>

<br />

Authenticate a user and get an AccessToken.

```js
const { login } = require("@slimio/registry-sdk");

const myToken = await login("admin1", "admin1953");

// Return a random string.
console.log("Your token is :", myToken);
```
Return an AccessToken which will be required for some methods

<br />

</details>

<details><summary>users(username: string, password: string): Promise < userId ></summary>

<br />

Create a new user with a new ID.

```js
const { users } = require("@slimio/registry-sdk");

const { userId } = users("newUsername", "newPassword");

// Return a new ID 
console.log(userId);
```

<br />

</details>

<details><summary>publish(addonMainDir: string, token: string): Promise < addonId ></summary>

<br />

Create or update an Addon release. This endpoint require an AccessToken.

>⚠️ publish() to need that your main directory must contain package.json and slimio.toml files !

```js
const { login, publish } = require("@slimio/registry-sdk");

const myToken = await login("myUsername", "myPassword");
const { addonId } = await publish("pathOfAddonMainDir", myToken);

console.log(addonId);
}
```

<br />

</details>

<details><summary>addon(): Promise < addonsArray ></summary>

<br />

Get all available addons.

```js
const { addon } = require("@slimio/registry-sdk");

addon().then(console.log).catch(console.error);
```

- Return :
```js
[index: number]: string;
```
```js
// Example :
[
    "memory",
    "socket",
    "etc."
]
```
</details>

<details><summary>addonName(name: string): Promise < addonInfos ></summary>

<br />

Get a given addon by his name.

```js
const { addonName } = require("@slimio/registry-sdk");

addonName("name").then(console.log).catch(console.error);
```

- Return :
```js
{
    name: string,
    description: string,
    git: string,
    createdAt: Date,
    updatedAt: Date,
    author: {
        username: string,
        description: string
    },
    organisations: {
        name: string,
        createdAt: Date,
        updatedAt: Date
    },
    version: [
        {
            version: string,
            createdAt: string
        }
    ]
}
```
</details>

<details><summary>orga(): Promise < listOrgas ></summary>

<br />

Get all organisations.

```js
const { orga } = require("@slimio/registry-sdk");

orga().then(console.log).catch(console.error);
```

- Return :
```js
{
    [name: string]: {
        description: string,
        owner: string,
        users: string[]
        addons: string[]
    }
}
```
</details>

<details><summary>orgaName(name: string): Promise < orgaInfos ></summary>

<br />

Get an organisation by his name.

```js
const { orgaName } = require("@slimio/registry-sdk");

orgaName("name").then(console.log).catch(console.error);
```

- Return :
```js
{
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date,
    owner: {
        username: string,
        createdAt: Date,
        updatedAt: Date
    },
    users: [
        {
            username: string,
            createdAt: Date,
            updatedAt: Date
        }
    ]
    addons: [
        {
            name: string,
            description: string,
            git: string,
            createdAt: Date,
            updatedAt: Date
        }
    ]
}
```
</details>

<details><summary>orgaAddUser(organame: string, username: string, token: string): Promise < orgaUserinfos ></summary>

<br />

Add a user to an organisation. This endpoint require an AccessToken.

```js
const { login, orgaAddUser } = require("@slimio/registry-sdk");

async function main() {
    // If the user to add desn't exist in the database, create this.
    await users("newUsername", "newPassword");

    const myToken = await login("myUsername", "myPassword");
    const interfaceRet = await orgaAddUser("orgaName", "newUsername", myToken);

    return interfaceRet;
}

main().then(console.log).catch(console.error);
```
- Return :

```js
{
    createdAt: date,
    updatedAt: date,
    organisationId: number,
    userId: number
}
```
</details>

## License
MIT
