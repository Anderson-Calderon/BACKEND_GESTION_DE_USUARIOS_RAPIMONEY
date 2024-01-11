
import connectDB from "../config/db.js";




/**
 * Gets a list of users from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Respuesta JSON con la lista de usuarios.
 */
const getUsers = async (req,res)=>{

    let db;

    try{


                // Extract query parameters from request
                const{numberUsers , offset} = req.query;

                console.log(numberUsers , offset);

                // Connect to database
                db = connectDB();   

                console.log(db);

                if(db){
                    console.log("instamcia db existe");
                    console.log(db);

                }

                // SQL query to get users with limit and offset
                let sql = "SELECT  * FROM clientes ORDER BY id ASC   LIMIT ? OFFSET ?  ";


                // Run the query and get the results using a promise
                const users = await new Promise((resolve,reject)=>{

                    db.all(sql, [numberUsers,offset] , (err,rows) =>{

                        if(err){

                            console.log("error ?");
                            //Response in case of an error when making the query
                            reject(err);

                        }else{
                            //We return the requested data if everything is correct when making the query
                            resolve(rows);

                        }


                    });


                }) 
                
                // Send list of users as JSON response
                res.json(users);

            

    }catch(err){

                console.log(err);

                // Handle errors and return an error response
                const error = new Error(err.message)
                return res.status(500).json({error});


    }finally{

        // Close the connection to the database if it is open
        if(db){

                db.close();


            }

    }

    

  

  

}



/**
 * Search for a user by their identity document number (DNI).
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON with the information of the found user or an error message if not found.
 */

const searchUser = async (req,res)=>{
    // Obtain the ID from the request parameters.
    const {dni} = req.params;

    let db;

    try{


                    
                // Connect to the database.
                db = connectDB();   

                 // SQL query to search for a user by ID.
                let sql = "SELECT  * FROM clientes WHERE dni=?";

                // Execute the query with the provided ID.
                const userExists = await new Promise((resolve,reject)=>{

                    db.all(sql, [dni] , (err,row) =>{

                        if(err){

                            reject(err);

                        }else{

                            resolve(row);

                        }


                    });


                });

               
                 // Check if any user was found.
                if(userExists.length==0){

                    // If the user is not found, return a 404 error message.
                    const error = new Error("No se encontró usuario alguno con el número de documento de identidad (DNI) proporcionado : "+dni);

                    return res.status(404).json({msg:error.message});
                }
                
                 // Returns the information of the found user.
                res.json(userExists);

            

    }catch(err){

                  // Handle errors and return a 500 error message on failure.
                const error = new Error(err.message)
                return res.status(500).json({error});


    }finally{

        // Close the connection to the database after execution.
        if(db){

                db.close();


            }

    }

    



}

/**
 * Create a new user in the database.
 * @param {Object} req - Express request object containing the user data to be created.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON with a success message if the user is created successfully or an error message if it already exists or there is a problem.
 */


const createUser = async (req,res)=>{

    // Extract data from the request body.
    const {
           dni,
           name:nombres,
           lastName:apellidos,
           birthDay:fecha_nacimiento,
           cellPhone:celular,
           email:correo,
           bank:banco,
           cci:numero_cci
          } = req.body;

 
          let db;



          try{
      

                          
                    // Connect to the database.
                  
                    db = connectDB();   


                    // Check if a user already exists with the same ID.
                    let sql = "SELECT  * FROM clientes WHERE dni=?";

                    const userExists = await new Promise((resolve,reject)=>{

                        db.all(sql, [dni] , (err,rows) =>{

                            if(err){

                                reject(err);

                            }else{

                                resolve(rows);

                            }


                        });


                    });

                     // If a user with the same ID already exists, return a 409 (conflict) error message.
                    if(userExists.length>0){

                        
                        const error = new Error("Ya hay un usuario registrado con el número de documento de identidad (DNI) proporcionado: "+userExists[0].dni);

                        return res.status(409).json({msg:error.message});
                    }
      
                     // Insert a new user into the database.
                     sql = "INSERT INTO clientes(dni,nombres,apellidos,fecha_nacimiento,celular,correo,banco,numero_cci) VALUES (? , ? , ? , ? , ? , ? , ? ,?)";
                    
                     const fechaHoraActual = new Date();



                      const user = await new Promise((resolve,reject)=>{
      
                          db.run(sql, [dni,nombres,apellidos,fecha_nacimiento,celular,correo,banco,numero_cci] , (err,rows) =>{
      
                              if(err){
      
                                  reject(err);
      
                              }else{
      
                                  resolve({msg:"Usuario agregado correctamente"});
      
                              }
      
      
                          });
      
      
                      }) 
                      
                       // Devolver un mensaje de éxito
                      res.json(user);
      
                  
      
          }catch(err){

                    //Handle errors and return a 500 error message on failure.
              
                     const error = new Error(err.message)
                     
                      return res.status(500).json({error});
      
      
          }finally{
      
                // Close the connection to the database after execution.
              if(db){
      
                      db.close();
      
      
                  }
      
          }
      


}




export {


            getUsers,
            createUser,
            searchUser


       }