import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import fastifyJwt from "@fastify/jwt";
import { userSchemas } from './schema/users/users';
//import userRoutes from "./routes/users/users";


export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Place here your custom code!
  void fastify.register(fastifyJwt,{
    secret:'iFUnzaSecret'
  });
    for (const schema of userSchemas) {
    void fastify.addSchema(schema);
  }
  //void fastify.register(userRoutes, {prefix: 'api/users'})
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

};

export default app;
export { app }



// import Fastify from "fastify";
// import fjwt from "@fastify/jwt";
// import userRoutes from "./routes/users/users";
// import { userSchemas } from "./schema/users/users";




// export const server = Fastify()


// server.register(fjwt, {
//   secret: "icdbvisdhreb784y58vncf78yt385",
// });




// server.get("/healthcheck", async function() {
//   return { status: "OK!"}
// })

// async function main() {


//   server.register(userRoutes, {prefix: 'api/users'})

//   try {
//     await server.listen({ port: 3000 });
//     console.log(`server ready at http://localhost:3000`);
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// }

// main()