import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
  

  fastify.get('/test', (request, reply) => {
    return "test"
  })
}

export default root;
