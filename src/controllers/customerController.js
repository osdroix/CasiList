const { ObjectId } = require('mongodb'); // Importar ObjectId de mongodb
const { client } = require('../conexion/conexion');

// Función para listar todas las colecciones disponibles y renderizar la página principal
const listCollections = async (req, res) => {
  try {
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const collectionDetails = await Promise.all(collections.map(async (collection) => {
      const col = db.collection(collection.name);
      const fileCount = await col.countDocuments(); // Contamos los documentos en cada colección
      return { name: collection.name, fileCount }; // Devuelve el nombre y el conteo de archivos
    }));
    res.render('index', { collectionDetails }); // Envía los detalles de las colecciones a la vista 'index'
  } catch (error) {
    console.error("Error al listar colecciones y contar archivos:", error);
    res.status(500).send("Error al cargar la lista de colecciones");
  }
};

// Función para crear una nueva colección
const createCollection = async (req, res) => {
  const collectionName = req.body.collectionName;
  try {
    const db = client.db();
    await db.createCollection(collectionName);
    res.redirect('/');  // Redirige a la página principal
  } catch (error) {
    console.error("Error al crear la colección:", error);
    res.status(500).send("Error al crear la colección");
  }
};

// Función para subir archivos a una colección
const uploadFile = async (req, res) => {
  const { collectionName } = req.body;
  const file = req.file;
  try {
    const db = client.db();
    const collection = db.collection(collectionName);
    await collection.insertOne({ fileData: file.buffer, contentType: file.mimetype, filename: file.originalname });
    res.redirect('/');  // Redirige a la página principal
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    res.status(500).send("Error al subir el archivo");
  }
};

// Función para obtener archivos de una colección específica y renderizar la vista 'collection-details'
const getFilesFromCollection = async (req, res) => {
    const collectionName = req.query.collection;
    try {
      const db = client.db();
      const collection = db.collection(collectionName);
      const files = await collection.find({}).toArray();
      res.render('collection-details', { files, currentCollection: collectionName }); // Renderiza la vista de detalles de colección
    } catch (error) {
      console.error("Error al obtener archivos de la colección:", error);
      res.status(500).send("Error al cargar archivos");
    }
};
// Función para descargar archivos
const downloadFile = async (req, res) => {
  const { collection: collectionName, fileId } = req.query;
  try {
      const db = client.db();
      const collectionObj = db.collection(collectionName);
      // Ahora usar simplemente new ObjectId(fileId)
      const file = await collectionObj.findOne({ _id: new ObjectId(fileId) });
      if (file) {
          res.set('Content-Type', file.contentType);
          res.send(file.fileData.buffer);
      } else {
          res.status(404).send('Archivo no encontrado');
      }
  } catch (error) {
      console.error("Error al descargar el archivo:", error);
      res.status(500).send("Error al procesar la descarga");
  }
};

// Función para eliminar archivos
const deleteFile = async (req, res) => {
  const { collectionName, fileId } = req.body;
  try {
      const db = client.db();
      const collection = db.collection(collectionName);
      await collection.deleteOne({ _id: new ObjectId(fileId) }); // Usa new ObjectId correctamente
      res.redirect('/files?collection=' + collectionName); // Redirige de vuelta a la lista de archivos
  } catch (error) {
      console.error("Error al eliminar el archivo:", error);
      res.status(500).send("Error al eliminar el archivo");
  }
};
// Función para eliminar colecciones
const deleteCollection = async (req, res) => {
  const { collectionName } = req.body;
  try {
      const db = client.db();
      await db.dropCollection(collectionName);
      res.redirect('/'); // Redirige de vuelta a la página principal
  } catch (error) {
      console.error("Error al eliminar la colección:", error);
      res.status(500).send("Error al eliminar la colección");
  }
};

// Función para renombrar colecciones
const renameCollection = async (req, res) => {
  const { oldName, newName } = req.body;
  try {
    const db = client.db();
    const oldCollection = db.collection(oldName);

    // Crear una nueva colección con el nuevo nombre
    const newCollection = await db.createCollection(newName);

    // Copiar todos los documentos de la colección antigua a la nueva
    const cursor = oldCollection.find();
    await cursor.forEach(doc => newCollection.insertOne(doc));

    // Eliminar la colección antigua
    await oldCollection.drop();

    res.redirect('/'); // Redirige de vuelta a la página principal
  } catch (error) {
    console.error("Error al renombrar la colección:", error);
    res.status(500).send("Error al renombrar la colección");
  }
};


module.exports = {
  listCollections,
  createCollection,
  uploadFile,
  getFilesFromCollection,
  downloadFile,
  deleteFile,
  deleteCollection,
  renameCollection
};
