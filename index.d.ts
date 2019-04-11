
declare namespace RegistrySDK {

    interface MetaData {
        uptime: number
    }
    
    interface AccessToken {
        access_token: string
    }

    interface userId {
        userId: number
    }

    interface addonsArray {
        [index: number]: string
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
        createdAt: date,
        updatedAt: date,
        organisationId: number,
        userId: number
    }

    export function meta(): Promise <MetaData>;
    export function login(username: string, password: string): Promise <AccessToken>;
    export function users(username: string, password: string): Promise <userId>;
    export function addon(): Promise <addonsArray>;
    export function addonName(name: string): Promise <addonInfos>;
    export function publish(elems: { 
        name: string, 
        description?: string ,
        version: string,
        git: string,
        organisation?: string
    }, token: string): Promise <addonId>;
    export function orga(): Promise <listOrgas>
    export function orgaName(name: string): Promise <orgaInfos>
    export function orgaAddUser(organame: string, username: string, token: string): Promise <orgaUserinfos>
}

export as namespace RegistrySDK;
export = RegistrySDK;
