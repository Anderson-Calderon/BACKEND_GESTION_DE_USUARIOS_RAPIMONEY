// Import the Express framework
import express from "express";


// Imports drivers related to user operations
import {getUsers,createUser,searchUser} from "../controllers/UserController.js";

// Create a router to manage user routes
const userRouter = express.Router();

// Define a route to get all users
userRouter.get("/",getUsers);

// Define a route to create a new user
userRouter.post("/",createUser);

// Define a route to search for a user by their DNI number
userRouter.get("/:dni",searchUser);

// Export the router for use in other files
export default userRouter;