const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'ToDoList';

let db;  // Variable para almacenar la conexión de la base de datos

// Función para conectar a la base de datos y reutilizar la conexión
async function connectDB() {
    if (!db) {
        try {
            await client.connect();
            console.log(`Conectado correctamente al servidor: ${url}`);
            db = client.db(dbName);
        } catch (error) {
            console.error('Error al conectar con la base de datos:', error);
            throw error;
        }
    }
    return db;
}

// Insertar nueva tarea
async function insertarTarea(tarea) {
    try {
        const db = await connectDB();
        const collection = db.collection('tasks');
        const result = await collection.insertOne(tarea);
        console.log('Tarea insertada:', result);
    } catch (error) {
        console.error('Error al insertar tarea:', error);
    }
}

// Obtener todas las tareas
async function obtenerTareas() {
    try {
        const db = await connectDB();
        const collection = db.collection('tasks');
        const tareas = await collection.find({}).toArray();
        console.log('Tareas:', tareas);
        return tareas;
    } catch (error) {
        console.error('Error al obtener tareas:', error);
    }
}

// Filtrar tareas por estado
async function filtrarTareasPorEstado(done) {
    try {
        const db = await connectDB();
        const collection = db.collection('tasks');
        const tareas = await collection.find({ done }).toArray();
        console.log('Tareas filtradas por estado:', tareas);
        return tareas;
    } catch (error) {
        console.error('Error al filtrar tareas por estado:', error);
    }
}

// Actualizar el estado de una tarea
async function actualizarTarea(id, nuevoEstado) {
    try {
        const db = await connectDB();
        const collection = db.collection('tasks');
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { done: nuevoEstado } }
        );
        console.log('Tarea actualizada:', result);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
    }
}

// Eliminar una tarea
async function eliminarTarea(id) {
    try {
        const db = await connectDB();
        const collection = db.collection('tasks');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        console.log('Tarea eliminada:', result);
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    }
}

// Cerrar la conexión de la base de datos
async function cerrarConexion() {
    try {
        await client.close();
        console.log('Conexión con la base de datos cerrada');
    } catch (error) {
        console.error('Error al cerrar la conexión de la base de datos:', error);
    }
}

// Ejemplo de uso
async function main() {
    try {
        // Insertar una nueva tarea
        await insertarTarea({
            nombre: 'Leer libro',
            descripcion: 'Leer 20 páginas del libro',
            done: false,
        });

        // Obtener todas las tareas
        await obtenerTareas();

        // Filtrar tareas que aún no están completadas
        await filtrarTareasPorEstado(false);

        // Actualizar una tarea (requiere ObjectId)
        await actualizarTarea('66e1030236c550e2444de8ec', true);  // Pasa el ID en formato string

        // Eliminar una tarea
        await eliminarTarea('66e1030236c550e2444de8ec');  // Pasa el ID en formato string
    } catch (error) {
        console.error('Error en el flujo principal:', error);
    } finally {
        await cerrarConexion();  // Asegurar cerrar la conexión al final
    }
}

main().catch(console.error);
