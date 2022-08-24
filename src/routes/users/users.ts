import { FastifyInstance } from "fastify"

import { registerUserHandler, loginHandler, getUsersHandler, updateUserHandler, deleteUserHandler, getUserHandler} from "../../controllers/users/users" ;
import { $ref } from "../../schema/users/users";



async function userRoutes(server: FastifyInstance){

    server.post('/',
    {
        schema: {
            body: $ref("createUserSchema"),
            response: {
                201: $ref("createUserResponseSchema"),
            },
        },
    },
    registerUserHandler);

    server.post('/login', 
    {
        schema: {
            body: $ref("loginSchema"),
            response: {
                200: $ref("loginResponseSchema")
            },
        },
    },
    loginHandler);

    server.get(
        '/',
        {
            preHandler: server.authenticate //doesnt exist in fastify instance need to declare globally
        },
        getUsersHandler
    );

    server.get('/:id', getUserHandler)


    server.put('/update/user/:id', {
        schema: {
            body: $ref("updateUserSchema"),
            
            response: {
                201: $ref("updateUserResponseSchema")
            }
        }

    } ,
    updateUserHandler);

    server.delete('/delete/:id', deleteUserHandler)
    
}

export default userRoutes;