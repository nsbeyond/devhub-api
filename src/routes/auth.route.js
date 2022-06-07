import {
  validateToken,
  getInfo,
  login,
  register,
  multiUpload,
} from '../controllers/auth/auth.controller'

const routes = (fastify, options, done) => {
  fastify.get('/auth/info', getInfo)
  fastify.post('/auth/register', register)
  fastify.post('/auth/login', login)
  fastify.post('/auth/validate', validateToken)
  fastify.post('/upload', multiUpload)
  done()
}

export default routes
