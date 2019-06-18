declare namespace RegistrySDK {
    interface MetaData {
        uptime: number
    }

    interface addonInfos {
        name: string,
        description: string,
        git: string,
        createdAt: Date,
        updatedAt: Date,
        author: {
            username: string,
            description: string
        },
        organisation: {
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

    interface addonId {
        addonId: number
    }

    interface listOrgas {
        [name: string]: {
            description: string,
            owner: string,
            users: string[]
            addons: string[]
        }
    }

    interface orgaInfos {
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

    interface orgaUserinfos {
        createdAt: Date,
        updatedAt: Date,
        organisationId: number,
        userId: number
    }

    export function meta(): Promise<MetaData>;
    export function login(username: string, password: string): Promise<string>;
    export function createAccount(username: string, password: string, email: string): Promise<void>;
    export function getAllAddons(): Promise<string[]>;
    export function getOneAddon(name: string): Promise<addonInfos>;
    export function publishAddon(addonDirectory: string, token: string): Promise<addonId>;
    export function getAllOrganizations(): Promise<listOrgas>
    export function getOneOrganization(orgaName: string): Promise<orgaInfos>
    export function orgaAddUser(orgaName: string, username: string, token: string): Promise<orgaUserinfos>
    export namespace constants {
        export const registry_url: string | URL;
    }
}

export as namespace RegistrySDK;
export = RegistrySDK;
