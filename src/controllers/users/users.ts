import {  FastifyReply, FastifyRequest,   } from "fastify";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, LoginInput, UpdateUserInput, DeleteUserInput, GetUserInput } from "../../schema/users/users";
import { createUser, findUserByEmail, getAllUsers, updateUser, deleteUser, getUser} from "../../services/users/users";



export async function registerUserHandler(
    
    request: FastifyRequest<{
        Body: CreateUserInput;
    }>, 
    reply: FastifyReply
    ) {

        const body = request.body;

        try{
            const user = await createUser(body);

            return reply.code(201).send(user);
        }catch(e){
            console.log(e)
            return reply.code(500).send(e)
        }
    }

export async function loginHandler(
    request: FastifyRequest<{
    Body: LoginInput;
    }>, 
    reply: FastifyReply
    ) {

        const body = request.body;

        //find user by email
        const user = await findUserByEmail(body.email);

        if (!user) {
            return reply.code(401).send({
                message: "Invali Email or Password"
            })
        }
        // verify p/word
        const correctPassword = verifyPassword({
            candidatePassword: body.password,
            salt: user.salt,
            hash: user.password
        })

        if (correctPassword) {
            const {password, salt, ...rest} = user;
            
            //generate access token
            return {accessToken: request.server.jwt.sign(rest)};
        }

        //respond
        return reply.code(401).send({
            message: "Invali Email or Password"
        })
        

    }

export async function getUsersHandler(){
    const users = await getAllUsers()

    return users;
    
}

export async function getUserHandler(
    request: FastifyRequest<{
        Body: GetUserInput;
        Params:{
            id:string
        }
    }>, 
    reply: FastifyReply
    ){
        const {id} = request.params;
        

        const user = await getUser(id)

        return reply.code(200).send(user)

    }


export async function updateUserHandler(
    request: FastifyRequest<{
        Body: UpdateUserInput;
        Params:{
            id:string
        }
    }>, 
    reply: FastifyReply
    ) {
        const {id} = request.params;
        
        const name = request.body.name
        const email = request.body.email

        const user = await updateUser(id, name, email)

        return reply.code(201).send(user)

    
    }

export async function deleteUserHandler(
    request: FastifyRequest<{
        Body: DeleteUserInput;
        Params:{
            id:string
        }
    }>, 
    reply: FastifyReply
    ) {
        const {id} = request.params;
        

        const user = await deleteUser(id)

        return reply.code(200).send(user)

    
    }