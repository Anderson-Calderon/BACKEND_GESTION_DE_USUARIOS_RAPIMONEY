// Import the sqlite3 module
import sqlite3 from "sqlite3";
import path from "path";
// Function to connect to the database
const connectDB = ()=>{

    const dbPath = path.resolve(__dirname, '../rapimoney-db.db');
    // Create a database instance with the file "rapioney-db.db"
    const db = new sqlite3.Database(dbPath,sqlite3.OPEN_READWRITE , (err)=>{

        // Handle connection errors
        if(err){

            throw new Error(`Error al conectar con la BD: ${err.message}`);

        }

    });

    // Return the database instance
    return db;





}
// Export the function to be used in other files
export default connectDB;