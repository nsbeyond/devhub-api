import { getInfo, login, register } from '../controllers/auth/auth.controller'

const routes = (fastify, options, done) => {
  fastify.get('/auth/info', getInfo)
  fastify.put('/auth/register', register)
  fastify.post('/auth/login', login)
  done()
}

export default routes