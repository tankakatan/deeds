import { MongoClient, Db, Collection } from 'mongodb'

const host = process.env.DB_HOST || 'localhost'
const port = process.env.DB_PORT || 21017

let client: MongoClient = undefined

async function connect (options?: Parameters<typeof MongoClient.connect>[1]): Promise<MongoClient> {

    if (client) return Promise.resolve (client)

    return MongoClient.connect (`mongodb://${ host }:${ port }`, {
        ignoreUndefined: true,
        useNewUrlParser: true, ...options,
    }).then (c => client = c)
}

const collection = (db: Db, name: string) => new Proxy ({}, {

    get: (_, property: keyof Collection) => db.collection (name)[property]

}) as (db: Db, name: string) => Collection

const database = (name: string) => new Proxy ({}, {

    get (_, collection_name: string | keyof Db) {
        const db = client.db (name)
        return collection_name in db ? db[collection_name as keyof Db] : collection (db, collection_name)
    }

}) as (name: string) => (Db & { [name: string]: Collection })

const storage = new Proxy ({}, {

    get: (_, db_name: string | keyof MongoClient) => (
        connect ().then (client => db_name in client ? client[db_name as keyof MongoClient] : database (db_name))
    )

}) as Promise<MongoClient & { [key: string]: Db }>

export default storage
