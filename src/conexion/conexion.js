// conexion.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://root123:root123@atlascluster.i7yfe0w.mongodb.net/";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Database connected successfully");
    return client.db(); // Retorna la instancia db para usar en queries
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
};

module.exports = { connectDB, client };