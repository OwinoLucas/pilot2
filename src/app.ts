import Fastify from "fastify";
import fjwt from "@fastify/jwt";
import userRoutes from "./routes/users/users";
import { userSchemas } from "./schema/users/users";




export const server = Fastify()


server.register(fjwt, {
  secret: "icdbvisdhreb784y58vncf78yt385",
});




server.get("/healthcheck", async function() {
  return { status: "OK!"}
})

async function main() {
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }

  server.register(userRoutes, {prefix: 'api/users'})

  try {
    await server.listen({ port: 3000 });
    console.log(`server ready at http://localhost:3000`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main()