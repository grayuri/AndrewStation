import clientPromise from "./mdb"
import { ObjectId } from "mongodb"
import getErrorObject from "@/utils/getErrorObject"

const FourHundredErrorsNames = [
  "BadValue",
  "NoSuchKey",
  "UnsupportedFormat",
  "InvalidBSON",
  "InvalidIdField",
  "EmptyFieldName",
  "InvalidOptions",
  "InvalidNamespace",
  "InvalidNamespace",
  "OperationIncomplete",
  "RoleDataInconsistent",
  "RoleDataInconsistent",
  "NoMatchParseContext",
  "NoProgressMade",
  "RemoteResultsUnavailable",
  "InvalidReplicaSetConfig",
  "OperationFailed",
  "IncompatibleAuditMetadata",
  "IncompatibleShardingMetadata",
  "LockFailed",
  "InconsistentReplicaSetNames",
  "NotExactValueField",
  "WriteConflict",
  "InitialSyncFailure",
  "InvalidSyncSource",
  "InvalidPipelineOperator",
  "TooManyMatchingDocuments",
  "BrokenPromise",
]

const FourZeroFourErrorsNames = [
  "HostNotFound",
  "UserNotFound",
  "NamespaceNotFound",
  "IndexNotFound",
  "RoleNotFound",
  "PrivilegeNotFound",
  "CursorNotFound",
  "CommandNotFound",
  "ShardKeyNotFound",
  "ShardNotFound",
  "ReplicaSetNotFound",
  "NodeNotFound",
  "NoProjectionFound",
  "LockNotFound",
  "SymbolNotFound",
  "TransportSessionNotFound",
  "ZoneNotFound",
  "KeyNotFound",
  "DNSHostNotFound",
  "BSONError"
]

async function connectDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("AndrewStation")
    if (!db) throw new Error("This database doesn't exist. Add a valid database name!")
    return db
  } 
  catch (error) {
    let statusCode = 500

    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404

    return getErrorObject(error, statusCode)
  }
}

export async function getAllData(collectionName) {
  try {
    const db = await connectDatabase()
    const data = await db.collection(collectionName).find().toArray()
    return data
  } 
  catch (error) {
    let statusCode = 500

    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404

    return getErrorObject(error, statusCode)
  }
}

export async function getFilteredData(collectionName, dataFilter) {
  try {
    const db = await connectDatabase()
    const data = await db.collection(collectionName).find(dataFilter).toArray()
    return data
  } 
  catch (error) {
    let statusCode = 500

    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404

    return getErrorObject(error, statusCode)
  }
}

export async function getSingleData(collectionName, dataId) {
  try {
    const db = await connectDatabase()
    const data = await db.collection(collectionName).findOne({ _id: new ObjectId(dataId) })
    return data
  } 
  catch (error) {
    let statusCode = 500

    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404

    return getErrorObject(error, statusCode)
  }
}

export async function createSingleData(collectionName, data) {
  try {
    const db = await connectDatabase()
    const dbData = await db.collection(collectionName).insertOne(data)
    return dbData
  } 
  catch (error) {
    let statusCode = 500

    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404


    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404

    return getErrorObject(error, statusCode)
  }
}

export async function updateSingleData(collectionName, dataId, updatedData) {
  try {
    const db = await connectDatabase()
    const data = await db.collection(collectionName).updateOne(
      { _id: new ObjectId(dataId) }, 
      { $set: updatedData },
      { upsert: true }
    )
    return data
  } 
  catch (error) {
    let statusCode = 500

    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404

    return getErrorObject(error, statusCode)
  }
}

export async function deleteSingleData(collectionName, dataId) {
  try {
    const db = await connectDatabase()
    const data = await db.collection(collectionName).deleteOne({ _id: new ObjectId(dataId) })
    return data
    
  } 
  catch (error) {
    let statusCode = 500

    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404

    return getErrorObject(error, statusCode)
  }
}

export async function deleteManyData(collectionName, filter) {
  try {
    const db = await connectDatabase()
    const data = await db.collection(collectionName).deleteMany(filter)
    return data
  } 
  catch (error) {
    let statusCode = 500

    if (FourHundredErrorsNames.includes(error.name)) statusCode = 400
    if (FourZeroFourErrorsNames.includes(error.name)) statusCode = 404

    return getErrorObject(error, statusCode)
  }
}