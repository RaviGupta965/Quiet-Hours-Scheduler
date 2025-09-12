import mongoose from "mongoose"

declare global {
  // For hot-reloading in Next.js dev
  var mongooseConnection: mongoose.Connection | undefined
}

export const connectDB = async (): Promise<mongoose.Connection> => {
  if (mongooseConnection) return mongooseConnection

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables")
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "silentstudy",
      autoIndex: true,
    })
    console.log("MONGODB CONNNECTED SUCCESSFULLY")
    mongooseConnection = mongoose.connection
    return mongooseConnection
  } catch (error) {
    console.error("MONGODB :: CONNECTION ERROR", error)
    throw error
  }
}