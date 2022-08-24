import { FastifyReply, FastifyRequest  } from "fastify";
import { server } from "../../app";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, LoginInput } from "../../schema/users/users";
import { createUser, findUserByEmail, getAllUsers} from "../../services/users/users";

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
            return {accessToken: server.jwt.sign(rest)};
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