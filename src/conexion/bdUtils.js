// dbUtils.js
const { client } = require('./conexion'); // Importa el cliente de MongoDB desde conexion.js

const queryDB = async (collectionName, query, options = {}) => {
  try {
    const db = client.db(); // Obtiene la instancia de db desde el cliente conectado
    const collection = db.collection(collectionName);
    const results = await collection.find(query, options).toArray();
    return results;
  } catch (error) {
    console.error("Query failed:", error);
    throw error;
  }
};

module.exports = { queryDB };