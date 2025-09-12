import mongoose from "mongoose"

let isConnected = false
let mongooseConnection: mongoose.Connection

export const connectDB = async (): Promise<mongoose.Connection> => {
  if (isConnected && mongooseConnection) return mongooseConnection

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables")
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "silentstudy",
      autoIndex: true,
    })

    isConnected = true
    mongooseConnection = mongoose.connection
    console.log("MONGODB :: CONNECTED SUCCESSFULLY")

    return mongooseConnection
  } catch (error) {
    console.error("MONGODB :: CONNECTION ERROR", error)
    throw error
  }
}