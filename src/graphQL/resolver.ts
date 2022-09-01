const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//import { createPubSub } from '@graphql-yoga/node'
const { APP_SECRET } = require('../utils/jwt')
import { PrismaClient, Product} from "@prisma/client";
import { GraphQLError } from 'graphql';
const prisma = new PrismaClient();


// const dateScalar = new GraphQLScalarType({
//   name: 'Date',
//   parseValue(value) {
//     return new Date(value);
//   },
//   serialize(value) {
//     return value.toISOString();
//   },
// })


// const pubSub = createPubSub<{
//     updateUserMessage: [payload: {User:{}}]
// }>()

const Query = {
    me:async (roots:any,args:any,context:any,info:any) => {
        return await prisma.user.findFirst({
            where:{
                id:args?.id
            }
        })
    },
    allUsers:async () => {
        return await prisma.user.findMany();
    },
    authme:async (roots:any,args:any,context:any,info:any) => {
        if (context.user){
        const user = await prisma.user.findFirst({ where: {id: args.id}})
     
      
        if (user?.id ===context.user) {
            return user;
        }else{
            return Promise.reject(new GraphQLError("Not Current User"))
        }
        }else{
            return Promise.reject(new GraphQLError("Not Permitted"))
        }
    },
    product:async (roots:any,args:any,context:any,info:any) => {
        return await prisma.product.findFirst({
            where:{
                id:args?.id
            }
        })
    },
    allProducts:async () => {
        return await prisma.product.findMany();
    },

};
const Mutation = {
    //registers user
    signup:async (roots:any,args:any,context:any,info:any) => {
        // 1
        const password = await bcrypt.hash(args.password, 10)
        args.password = password;
        args.salt = '10';
        // 2
        const user = await prisma.user.create({ data: { ...args} })

        // 3
        const token = jwt.sign({ userId: user.id }, APP_SECRET)

        // 4
        return {
            token,
            user,
        }

    },
    //logs in user
    login:async(roots:any,args:any,context:any,info:any) => {
        // 1
        const user = await prisma.user.findUnique({ where: { email: args.email } })
        if (!user) {
          throw new Error('No such user found')
        }
      
        // 2
        const valid = await bcrypt.compare(args.password, user.password)
        if (!valid) {
          throw new Error('Invalid password')
        }
      
        const token = jwt.sign({ userId: user.id }, APP_SECRET)
      
        // 3
        return {
          token,
          user,
        }
    },
    //updates user info
    updateUser:async(roots:any,args:any,context:any,info:any) => {
        
	    const user =  await prisma.user.update({
            where:{
                id: args?.id,     
            },
            data:{
                name:args?.name,
                email:args.email
            }
        })
       // context.pubSub.subscribe("UPDATE_MESSAGE",args.id,updateUserMessage)
        return user

    },
    //delete user
    deleteUser:async(roots:any,args:any,context:any,info:any) => {
        return await prisma.user.delete({
            where: {
                id: args?.id
            }
        })
        
    },
    //add a product
    addproduct:async(roots:any,args:any,context:any,info:any) => {
        
	    const user = await prisma.user.findUniqueOrThrow({
	            where: {
	                id: context.user
	            }
	        })
	        console.log(context.user)
	        console.log(user)
	        if (user) {
	            
	            let data:Product ={...args,ownerId:context.user} 
	            console.warn()
	            const product = await prisma.product.create({
	                data:data
	            })
	            return product
	        }


         
    },
    //update a product
    updateproduct:async(roots:any,args:any,context:any,info:any) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: context.user
            }
        })
        console.log(context.user)
        console.log(user)
        if (user) {
            const product = await prisma.product.update({
                where: {
                    id: args?.id,
                },
                data: {
                    title: args.title,
                    price: args.price,
                    content: args.content
                }
            })
            return product
        }

    },
    //delete a product
    deleteproduct:async(roots:any,args:any,context:any,info:any) => {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: context.user
            }
        })
        console.log(context.user)
        console.log(user)
        if (user) {
            return await prisma.product.delete({
                where: {
                    id: args.id
                }
            })
         
        }
    },
}


const Subscription = {
    updateUserMessage: {
        subscribe: async function* (_:any, {from}: any) {
            for (let i = from; i <=  from; i--) {
                await new Promise((resolve: any) => setTimeout(resolve,1000))
                    yield {updateUserMessage: i}
                
                
            }          
        }        
    }
}

        
    

export {Query,Mutation,Subscription}