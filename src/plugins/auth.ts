import {FastifyRequest, FastifyReply, FastifyInstance, HookHandlerDoneFunction} from "fastify"
//fastify-jwt is depreciated hence requires to be wrapped in f-plugin
import fp from 'fastify-plugin'

// server.register(fjwt, {
//   secret: "icdbvisdhreb784y58vncf78yt385",
// });

export default fp(async function(server: FastifyInstance, opts) {
  
  server.decorate("authenticate", async function(request: FastifyRequest, reply: FastifyReply,done:HookHandlerDoneFunction) {
    try {
      if(await request.jwtVerify()){
        done();
      }
      return reply.code(401).send({message:"Invalid code"})
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
  
