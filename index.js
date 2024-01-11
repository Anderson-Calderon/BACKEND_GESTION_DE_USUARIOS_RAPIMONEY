import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//You import THE router that contains the routes related to user management
import userRouter from "./routes/UserRoutes.js";

//You create an instance of the Express application
const app = express();

app.use(express.json());//We allow the app to receive json type information.

dotenv.config(); //We allow the app to work with environment variables.

const whiteList = [process.env.FRONT_URL]; //White list of urls that can access the back end

const corsOptions={


                        origin: function(origin,callback){

                                    //ORIGIN IS THE URL OF THE PAGE THAT IS TRYING TO MAKE A REQUEST TO THE BACKEND

                                    if(whiteList.includes(origin)){ //WE VERIFY IF THE URL TRYING TO ACCESS THE BACKEND IS WITHIN THE WHITE LIST OF URLS

                                        //null - BECAUSE THERE IS NO ERROR MESSAGE
									    //true - WE GIVE YOU ACCESS
                                        callback(null,true);


                                    }else{
                                        //ERROR . THE URL THAT MAKES THE REQUEST TO THE SERVER IS NOT IN THE WHITE LIST
                                        callback(new Error("Error de Cors"));

                                    }
                                
                                
                                
                                }


                  }

/**
 * CORS middleware to manage request headers from different domains.
 * corsOptions is a specific setting that limits the URLs allowed to make requests to our server.
**/
app.use(cors(corsOptions));

//Todas las solicitudes (POST , GET , DELETE ...) con la ruta base "/api/users" serán manejadas por el enrutador userRouter
app.use("/api/users" , userRouter);

//Definimos el puerto en el que tu servidor estará escuchando
const PORT = process.env.PORT || 4000;

//inicia el servidor Express para escuchar las solicitudes entrantes en el puerto especificado
const servidor = app.listen(PORT , ()=>{

        console.log("CORRIENDO LA APP EN EL SERVIDOR : "+PORT);

});