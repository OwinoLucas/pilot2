import {FastifyRequest, FastifyReply, FastifyInstance, HookHandlerDoneFunction} from "fastify"
//fastify-jwt is depreciated hence requires to be wrapped in f-plugin
import fp from 'fastify-plugin'

export default fp(async function(server: FastifyInstance, opts) {
  server.register(require("@fastify/jwt"), {
    secret: "supersecret"
  })

  server.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply,done:HookHandlerDoneFunction) {
    try {
      await request.jwtVerify()
      done()
    } catch (err) {
      return reply.send(err)
    }
  })

})

//handles the error thrown by the prehandler in routes.ts 
declare module "fastify" {
    export interface FastifyInstance {
      authenticate(): string;
    }
}
  
