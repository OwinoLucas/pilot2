import { createServer, createPubSub} from '@graphql-yoga/node'
import fastify, { FastifyRequest, FastifyReply } from 'fastify'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { join } from 'path'
import {  Query, Mutation, Subscription } from './resolver'
import { getUserId } from '../utils/jwt'


const schema = loadSchemaSync([join(__dirname, './schema.gql'),join(__dirname, './queries.gql'),
join(__dirname, './mutations.gql'),join(__dirname, './subscriptions.gql')],
 { loaders: [new GraphQLFileLoader()] })

export const pubSub = createPubSub()

const resolvers = {
  Query: Query,
  Mutation: Mutation,
  Subscription: Subscription,
  
}


const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
})

// This is the fastify instance you have created
const app = fastify({ logger: true })
 
const graphQLServer = createServer<{
  req: FastifyRequest
  reply: FastifyReply
}>({
   schema: schemaWithResolvers
    ,
  // Integrate Fastify logger
  logging: {
    debug: (...args) => args.forEach((arg) => app.log.debug(arg)),
    info: (...args) => args.forEach((arg) => app.log.info(arg)),
    warn: (...args) => args.forEach((arg) => app.log.warn(arg)),
    error: (...args) => args.forEach((arg) => app.log.error(arg)),
  },
  context:(request)=>{
    try {
	let jwt:string = request.request.headers.get("Authorization")!;
	    let user = getUserId(request.request,jwt);
      
	    return {user};
} catch (error) {
	console.warn("Auth Failed")
  console.warn(error)
}

  },
  maskedErrors:false
})
 
/**
 * We pass the incoming HTTP request to GraphQL Yoga
 * and handle the response using Fastify's `reply` API
 * Learn more about `reply` https://www.fastify.io/docs/latest/Reply/
 **/
app.route({
  url: '/graphql',
  method: ['GET', 'POST', 'OPTIONS'],
  async handler(req, reply) {
    // Second parameter adds Fastify's `req` and `reply` to the GraphQL Context
    const response = await graphQLServer.handleIncomingMessage(req, {
      req,
      reply,
    })
    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })
 
    reply.status(response.status)
 
    reply.send(response.body)
 
    return reply
  },
})
 
app.listen({port :4000})